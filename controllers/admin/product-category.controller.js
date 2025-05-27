const ProductsCategory = require('../../models/product-category.model');
const systemConfig = require('../../config/system');
const Product = require("../../models/product.model");

// [GET] /product-category
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  const record = await ProductsCategory.find(find);

  res.render('admin/pages/product-category/index', {
    titlePage: 'Danh mục sản phẩm',
    record: record,
  });
};

// [GET] /product-category/create
module.exports.create = (req, res) => {
  res.render('admin/pages/product-category/create', {
    titlePage: 'Tạo bản ghi danh mục',
  });
};

// [POST] /product-category/create
module.exports.createPost = async (req, res) => {
  const body = req.body;

  const objectBody = {
    title: body.title,
    parent_id: body.parent_id,
    description: body.description,
    thumbnail: body.thumbnail,
    status: body.status,
    position: body.position,
  };

  if (objectBody.position === "") {
    const countProduct = await Product.countDocuments();
    const count = countProduct + 1;
    objectBody.position = count;
  } else {
    objectBody.position = +objectBody.position;
  }

  const record = new ProductsCategory(objectBody);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/product-category`);
};