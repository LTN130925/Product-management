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
