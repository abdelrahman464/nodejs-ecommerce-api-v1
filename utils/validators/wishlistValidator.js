const { check } = require("express-validator");
const Product = require("../../models/productModel");

exports.addProductToWishlistValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product required")
    .isMongoId()
    .withMessage("Invalid ID format")
    .custom((productId) => {
      Product.findById(productId).then((product) => {
        if (!product) {
          return Promise.reject(
            new Error(`No Product for this id : ${productId}`)
          );
        }
      });
    }),
];
