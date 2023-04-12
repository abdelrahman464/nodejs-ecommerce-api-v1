const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getsubCategoryValidator = [
  //rules
  check("id")
    .isMongoId()
    .withMessage("Invalid subCategory id format")
    .notEmpty()
    .withMessage("subCateogry must be belong to category"),
  //catch error
  validatorMiddleware,
];
exports.createSupCategroyValidator = [
  check("name")
    .notEmpty()
    .withMessage("subCategory required")
    .isLength({ min: 2 })
    .withMessage("too short subCategory name")
    .isLength({ max: 32 })
    .withMessage("too long subCategory name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("subCateogry must be belong to category")
    .isMongoId()
    .withMessage("Invalid Category id format"),

  validatorMiddleware,
];
exports.updateCategroyValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid subCategory id format")
    .notEmpty()
    .withMessage("subCateogry must be belong to category"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];
exports.deleteCategroyValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid subCategory id format")
    .notEmpty()
    .withMessage("subCateogry must be belong to category"),
  validatorMiddleware,
];
