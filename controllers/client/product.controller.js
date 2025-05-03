const Product = require("../../models/product.model");

// [GET] /products
module.exports.index = async (req, res) => {
  let find = {
    status: "active",
    deleted: false,
  };

  const products = await Product.find(find).sort({ position: "desc" });

  const newProduct = products.map((item) => {
    item.newPrice = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(2);
    return item;
  });

  res.render("client/pages/products/index", {
    pageTitle: "Trang sản phẩm",
    products: newProduct,
  });
};

// [GET] /products/detail/:slug
module.exports.detail = async (req, res) => {
  const find = {
    slug: req.params.slug,
    status: "active",
    deleted: false,
  };

  const product = await Product.findOne(find);

  product.newPrice = (
    (product.price * (100 - product.discountPercentage)) /
    100
  ).toFixed(2);

  res.render("client/pages/products/detail", {
    pageTitle: product.title,
    product: product,
  });
};
