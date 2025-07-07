const Product = require('../../models/product.model');
const ProductCategory = require('../../models/product-category.model');

const helperNewPrice = require('../../helper/newPrice');
const helperGetSubCategory = require('../../helper/products-category');

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

module.exports.slugCategory = async (req, res) => {
  try {
    const slug = req.params.slug_category;
    const category = await ProductCategory.findOne({
      slug: slug,
      status: 'active',
      deleted: false,
    });

    const listSubCategory = await helperGetSubCategory.getSubCategory(
      category.id
    );
    const listSubCategoryId = listSubCategory.map((item) => item.id);

    const products = await Product.find({
      product_category_id: { $in: [category.id, ...listSubCategoryId] },
      deleted: false,
      status: 'active',
    }).sort({ position: 'desc' });

    const newProductsNew = helperNewPrice.newPrice(products);

    res.render('client/pages/products/index', {
      titlePage: category.title,
      products: newProductsNew,
    });
  } catch (error) {
    req.flash('error', 'không tìm thấy!');
    res.redirect(`/products`);
  }
};
