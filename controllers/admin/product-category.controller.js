const ProductsCategory = require('../../models/product-category.model');

const helperSearch = require('../../helper/search');
const helperCreateTree = require('../../helper/create-tree');
const systemConfig = require('../../config/system');
const filterStatusHelper = require('../../helper/filterStatus');

// [GET] admin/products-category
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  // filter-status
  const filterStatus = filterStatusHelper(req.query, find);

  // search
  const objectSearch = helperSearch(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  const record = await ProductsCategory.find(find);
  const newRecord = helperCreateTree.tree(record);

  res.render('admin/pages/product-category/index', {
    titlePage: 'Danh mục sản phẩm',
    records: newRecord,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
  });
};

// [GET] admin/products-category/trash
module.exports.trash = async (req, res) => {
  const find = {
    deleted: true,
  };

  // filter-status
  const filterStatus = filterStatusHelper(req.query, find);

  // search
  const objectSearch = helperSearch(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  const record = await ProductsCategory.find(find);

  res.render('admin/pages/product-category/trash', {
    titlePage: 'Trang sản phẩm rác',
    records: record,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
  });
};

// [GET] admin/products-category/create
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

// [POST] admin/products-category/create
module.exports.createPost = async (req, res) => {
  try {
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
    req.flash('success', 'tạo danh mục thành công!');
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  } catch (error) {
    req.flash('success', 'tạo danh mục thành công!');
    res.redirect(`${systemConfig.prefixAdmin}/products-category/create`);
  }
};

// [DELETE] admin/products-category/deleted/:id
module.exports.deleted = async (req, res) => {
  const id = req.params.id;
  await ProductsCategory.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedAt: new Date(),
    }
  );
  req.flash('success', 'xóa danh mục thành công!');
  res.redirect(req.get('Referrer') || '/');
};

// [GET] admin/products-category/trash/change-status/:status/:id
// [GET] admin/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const objectParams = {
    status: req.params.status,
    id: req.params.id,
  };
  const { status, id } = objectParams;
  await ProductsCategory.updateOne({ _id: id }, { status: status });
  req.flash('success', 'Cập nhật trạng thái thành công!');
  res.redirect(req.get('Referrer') || '/');
};

// [PATCH] admin/products-category/change-multi
// [PATCH] admin/products-category/trash/change-multi
module.exports.changeMulti = async (req, res) => {
  const objectBody = {
    ids: req.body.ids.split(', '),
    type: req.body.type,
  };
  const { ids, type } = objectBody;
  switch (type) {
    case 'active':
      await ProductsCategory.updateMany(
        { _id: { $in: ids } },
        { status: type }
      );
      req.flash(
        'success',
        `Cập nhật ${ids.length} bản ghi hoạt động thành công!`
      );
      break;
    case 'inactive':
      await ProductsCategory.updateMany(
        { _id: { $in: ids } },
        { status: type }
      );
      req.flash(
        'success',
        `Cập nhật ${ids.length} bản ghi không hoạt động thành công!`
      );
      break;
    case 'recovery-all':
      await ProductsCategory.updateMany(
        { _id: { $in: ids } },
        { deleted: false }
      );
      req.flash('success', `Khôi phục ${ids.length} bản ghi thành công!`);
      break;
    case 'delete-all':
      await ProductsCategory.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedAt: new Date(),
        }
      );
      req.flash('success', `Xóa ${ids.length} bản ghi thành công!`);
      break;
    case 'permanentlyDelete-all':
      await ProductsCategory.deleteMany({ _id: { $in: ids } });
      req.flash('success', `Xóa vĩnh viễn ${ids.length} bản ghi thành công!`);
      break;
    case 'change-position':
      for (const item of ids) {
        let [id, position] = item.split('-');
        await ProductsCategory.updateOne({ _id: id }, { position: +position });
      }
      req.flash('success', `Cập nhật vị trí ${ids.length} bản ghi thành công!`);
      break;
    default:
      break;
  }
  res.redirect(req.get('Referrer') || '/');
};

// [PATCH] admin/products-category/trash/recovery/:id
module.exports.recovery = async (req, res) => {
  const id = req.params.id;
  await ProductsCategory.updateOne({ _id: id }, { deleted: false });
  req.flash('success', 'Khôi phục danh mục thành công!');
  res.redirect(req.get('Referrer') || '/');
};

// [DELETE] admin/products-category/trash/permanentlyDelete/:id
module.exports.permanentDelete = async (req, res) => {
  const id = req.params.id;
  await ProductsCategory.deleteOne({ _id: id });
  req.flash('success', 'xóa vĩnh viễn danh mục thành công!');
  res.redirect(req.get('Referrer') || '/');
};

// [GET] admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const record = await ProductsCategory.findOne({
      _id: id,
      deleted: false,
    });

    if (record.parent_id === '') {
      record.category = '';
    } else {
      const category = await ProductsCategory.findOne({
        _id: record.parent_id,
        deleted: false,
      });
      record.category = category.title;
    }

    res.render('admin/pages/product-category/detail', {
      pageTitle: 'Chi tiết danh mục',
      record: record,
    });
  } catch (error) {
    req.flash('error', 'Lỗi ID!');
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

// [GET] admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const records = await ProductsCategory.find({ deleted: false });
    const recordTree = helperCreateTree.tree(records);
    const record = await ProductsCategory.findOne(find);

    res.render('admin/pages/product-category/edit', {
      titlePage: 'Sửa danh mục',
      recordTree: recordTree,
      records: record,
    });
  } catch (error) {
    req.flash('error', 'Danh mục không tồn tại!');
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};

// [PATCH] admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  const body = req.body;

  const objectBody = {
    title: body.title,
    parent_id: body.parent_id,
    description: body.description,
    thumbnail: body.thumbnail,
    status: body.status,
    position: body.position,
  };

  objectBody.position = body.position === '' ? 0 : +objectBody.position;

  try {
    await ProductsCategory.updateOne({ _id: req.params.id }, objectBody);
    req.flash('success', 'Sửa danh mục thành công!');
  } catch (error) {
    req.flash('error', 'Danh mục không tồn tại!');
  }
  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};
