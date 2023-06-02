const convertToArray = (req, res, next) => {
  if (req.body.subCategories) {
    // If it's not an array, convert it to an array
    if (!Array.isArray(req.body.subCategories)) {
      req.body.subCategories = [req.body.subCategories];
    }
  }
  if (req.body.colors) {
    // If it's not an array, convert it to an array
    if (!Array.isArray(req.body.colors)) {
      req.body.colors = [req.body.colors];
    }
  }
  next();
};

module.exports = convertToArray;
