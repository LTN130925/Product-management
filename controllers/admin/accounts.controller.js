const md5 = require('md5');

const Account = require('../../models/account.model');
const Role = require('../../models/role.model');
const systemConfig = require('../../config/system');

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  const records = await Account.find(find).select('-password -token');
  res.render('admin/pages/accounts/index', {
    titlePage: 'Trang danh sách tài khoản',
    records: records,
  });
};

// [GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const records = await Role.find({ deleted: false });
  res.render('admin/pages/accounts/create', {
    titlePage: 'Thêm mới tài khoản',
    records: records,
  });
};

// [POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  try {
    const find = {
      email: req.body.email,
      deleted: false,
    };
    const emailExits = await Account.findOne(find);
    if (emailExits) {
      req.flash('error', 'Email đã tồn tại, vui lòng nhập email khác!');
      res.redirect(req.get('Referrer') || '/');
      return;
    } else {
      req.body.password = md5(req.body.password);
      const record = new Account(req.body);
      await record.save();
      req.flash('success', 'Tạo tài khoản thành công!');
    }
  } catch (error) {
    req.flash('error', 'Tạo tài khoản thất bại!');
  }
  res.redirect(`${systemConfig.prefixAdmin}/accounts`);
};

// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      _id: req.params.id,
      deleted: false,
    };
    const data = await Role.find({ deleted: false });
    const records = await Account.findOne(find).select('-password -token');
    res.render('admin/pages/accounts/detail', {
      titlePage: 'Trang chi tiết tại khoản',
      records: records,
      data: data,
    });
  } catch (error) {
    req.flash('error', 'Lỗi Id');
    res.redirect(req.get('Referrer') || '/');
  }
};

// [PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  console.log(req.params);
  await Account.updateOne(
    { _id: req.params.id },
    { status: req.params.status }
  );
  req.flash('success', 'Cập nhật trang thái thành công!');
  res.redirect(req.get('Referrer') || '/');
};

// [DELETE] /admin/accounts/delete/:id
module.exports.delete = async (req, res) => {
  console.log(req.params);
  await Account.updateOne({ _id: req.params.id }, { deleted: true });
  req.flash('success', 'Xóa tài khoản thành công!');
  res.redirect(req.get('Referrer') || '/');
};

// [GET] /admin/accounts/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      _id: req.params.id,
      deleted: false,
    };
    const data = await Role.find({ deleted: false });
    const records = await Account.findOne(find);
    res.render('admin/pages/accounts/edit', {
      titlePage: 'Thêm mới tài khoản',
      data: data,
      records: records,
    });
  } catch (error) {
    req.flash('error', 'Lỗi Id');
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
};

// [PATCH] /admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const find = {
      _id: { $ne: id },
      email: req.body.email,
      deleted: false,
    };
    const emailExits = await Account.findOne(find);
    if (emailExits) {
      req.flash('error', 'Email đã tồn tại!');
      res.redirect(req.get('Referrer') || '/');
      return;
    }
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }

    await Account.updateOne({ _id: id }, req.body);
    req.flash('success', 'Chỉnh sửa tài khoản thành công!');
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  } catch (error) {
    req.flash('error', 'Chỉnh sửa tài khoản thất bại!');
    res.redirect(req.get('Referrer') || '/');
  }
};
