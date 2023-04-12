const stripe = require("stripe")(
  "sk_test_51MwAUQGzwHa0nr5TTmR18s20ZIWn4BXVIJoKN36aJ6IDiykIH486DykrASrxdEXXNq0pk6zpQvfNmqschaQibIBF00dmluI50u"
);
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const factory = require("./handllerFactory");

const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

//@desc create cash order
//@route POST /api/v1/orders/:cartId
//@access protected/user
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const { cartId } = req.params;
  //app settings
  const taxPrice = 0;
  const shippingPrice = 0;
  //1) get cart depend on catrId
  const cart = await Cart.findById(cartId);
  if (!cart) {
    return next(
      new ApiError(`there is no cart with id ${req.params.catrId}`, 404)
    );
  }
  //2) get order price cart price  "check if copoun applied"
  const cartPrice = cart.totalCartpriceAfterDiscount
    ? cart.totalCartpriceAfterDiscount
    : cart.totalCartprice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  //3)create order with default payment method cash
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });
  //4) after creating order  decerement product quantity and increment product sold
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOptions, {});
    //5)clear cart depend on cartId
    await Cart.findByIdAndDelete(cartId);
  }
  res.status(201).json({ status: "success", data: order });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});
//@desc get all orders
//@route GET /api/v1/orders/:cartId
//@access protected/user-admin-manager
exports.findAllOrders = factory.getALl(Order);
//@desc get specifi orders
//@route GET /api/v1/orders/cartId
//@access protected/user-admin-manager
exports.findSpecificOrder = factory.getOne(Order);
//@desc update order paid status to paid
//@route PUT /api/v1/orders/:id/pay
//@access protected/admin-manager
exports.updateOrderToPay = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`there is no such a order for this id ${req.params.id}`, 404)
    );
  }
  //update order to payed
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});
//@desc update order delivered status to delivered
//@route PUT /api/v1/orders/:id/deliver
//@access protected/admin-manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`there is no such a order for this id ${req.params.id}`, 404)
    );
  }
  //update order to payed
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});

//@desc Get checkout session from stripe and send it as response
//@route GET /api/v1/orders/checkout-session/cartId
//@access protected/user
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  const { cartId } = req.params;
  //app settings
  const taxPrice = 0;
  const shippingPrice = 0;
  //1) get cart depend on catrId
  const cart = await Cart.findById(cartId);
  if (!cart) {
    return next(
      new ApiError(`there is no cart with id ${req.params.catrId}`, 404)
    );
  }
  //2) get order price cart price  "check if copoun applied"
  const cartPrice = cart.totalCartpriceAfterDiscount
    ? cart.totalCartpriceAfterDiscount
    : cart.totalCartprice;
  const totalOrderPrice = Math.ceil(cartPrice + taxPrice + shippingPrice);

  //3)create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          unit_amount: totalOrderPrice * 100,
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,

    client_reference_id: req.params.cartId, // i will use to create order
    metadata: req.body.shippingAddress,
  });

  //4) send session to response
  res.status(200).json({ status: "success", session });
});
