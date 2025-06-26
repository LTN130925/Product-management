const Role = require('../../models/role.model');

const systemConfig = require('../../config/system');

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  }

  const records = await Role.find(find);

  res.render("admin/pages/roles/index", {
    titlePage: 'Phân quyền',
    records: records,
  })
}

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    titlePage: 'Tạo mới quyền',
  })
}

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  const objectBody = {
    title: req.body.title,
    description: req.body.description,
  };
  const record = new Role(objectBody);
  await record.save();

  req.flash('success', 'tạo quyền thành công!');
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

// [GET] /admin/detai/:id
module.exports.detail = async (req, res) => {
  const find = {
    _id: req.params.id,
    deleted: false
  }
  const record = await Role.findOne(find);
  res.render("admin/pages/roles/detail", {
    titlePage: 'Chi tiết quyền',
    record: record,
  })
}

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      _id: req.params.id,
      deleted: false
    }
    const record = await Role.findOne(find);

    res.render("admin/pages/roles/edit", {
      titlePage: 'Sửa quyền',
      record: record,
    })
  } catch (error) {
    req.flash('error', 'ID tồn tại!');
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
}

// [PATCH] admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    await Role.updateOne({ _id: req.params.id }, req.body);
    req.flash('success', 'Sửa thành công!');
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    req.flash('error', 'Lỗi!');
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
}

// [DELETE] /admin/roles/permanent-delete/:id
module.exports.delete = async (req, res) => {
  const id = req.params.id;
  await Role.deleteOne({ _id: id });
  req.flash('success', 'Xóa thành công!');
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
}