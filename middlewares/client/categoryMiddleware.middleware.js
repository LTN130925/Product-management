const productsCategory = require('../../models/product-category.model');

const helperCreateTree = require('../../helper/create-tree');

module.exports.layoutProductsCategory = async (req, res, next) => {
  const records = await productsCategory.find({ deleted: false });
  const categoryProducts = helperCreateTree.tree(records);

  res.locals.layoutCategoryProducts = categoryProducts;
  next();
};
