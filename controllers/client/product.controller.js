const Product = require('../../models/product.model');

const helperNewPrice = require('../../helper/newPrice');

// [GET] /products
module.exports.index = async (req, res) => {
  let find = {
    status: 'active',
    deleted: false,
  };

  const products = await Product.find(find).sort({ position: 'desc' });

  const newProductsNew = helperNewPrice.newPrice(products);

  res.render('client/pages/products/index', {
    pageTitle: 'Trang sản phẩm',
    products: newProductsNew,
  });
};

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
  const find = {
    slug: req.params.slug,
    status: 'active',
    deleted: false,
  };

  const product = await Product.findOne(find);

  product.newPrice = (
    (product.price * (100 - product.discountPercentage)) /
    100
  ).toFixed(2);

  res.render('client/pages/products/detail', {
    pageTitle: product.title,
    product: product,
  });
};
