const ProductsCategory = require('../../models/product-category.model');

const helperCreateTree = require('../../helper/create-tree');
const createTree = helperCreateTree.createTree;
const systemConfig = require('../../config/system');

// [GET] admin/product-category
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };
  const record = await ProductsCategory.find(find);
  const newRecord = helperCreateTree.tree(record)

  res.render('admin/pages/product-category/index', {
    titlePage: 'Danh mục sản phẩm',
    records: newRecord,
  });
};

// [GET] admin/product-category/create
module.exports.create = async (req, res) => {
  const find = {
    deleted: false,
  };
  const record = await ProductsCategory.find(find);
  const newRecord = helperCreateTree.tree(record);

  res.render('admin/pages/product-category/create', {
    titlePage: 'Tạo bản ghi danh mục',
    records: newRecord,
  });
};

// [POST] admin/product-category/create
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

  if (objectBody.position === '') {
    const countProduct = await ProductsCategory.countDocuments();
    const count = countProduct + 1;
    objectBody.position = count;
  } else {
    objectBody.position = +objectBody.position;
  }

  const record = new ProductsCategory(objectBody);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/product-category`);
};