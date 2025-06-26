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