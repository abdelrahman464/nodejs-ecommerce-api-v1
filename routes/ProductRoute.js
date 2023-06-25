const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");
const convertToArray = require("../middlewares/convertToArraysubCategoriesAndColors");
const authServices = require("../services/authServices");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../services/productService");

// nested routes
const reviewsRoute = require("./reviewRoute");

const router = express.Router();

router.use("/:productId/reviews", reviewsRoute);

router
  .route("/")
  .get(getProducts)
  .post(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    convertToArray,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authServices.protect,
    authServices.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    convertToArray,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authServices.protect,
    authServices.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
