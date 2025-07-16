const checkPassHelper = require('../../helper/checkPassword');

module.exports.registerPost = (req, res, next) => {
  if (!req.body.fullName) {
    req.flash('error', 'Phải nhập đầy đủ họ tên!');
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  if (!req.body.email) {
    req.flash('error', 'Phải nhập đầy đủ email!');
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  if (!req.body.password) {
    req.flash('error', 'Phải nhập đầy đủ mật khẩu!');
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  if (!checkPassHelper.isValidPassword(req.body.password)) {
    req.flash('error', 'mật khẩu định dạng không đúng quy đinh!');
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  next();
};

module.exports.loginPost = (req, res, next) => {
  if (!req.body.email) {
    req.flash('error', 'Phải nhập đầy đủ email!');
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  if (!req.body.password) {
    req.flash('error', 'Phải nhập đầy đủ mật khẩu!');
    res.redirect(req.get('Referrer') || '/');
    return;
  }

  next();
};
