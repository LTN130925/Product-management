const md5 = require('md5');

const User = require('../../models/user.model');

// [GET] /user/register
module.exports.register = (req, res) => {
  res.render('client/pages/user/register', {
    titlePage: 'Đăng kí tài khoản',
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  const email = req.body.email;
  const emailExits = await User.findOne({
    email: email,
  });

  if (emailExits) {
    req.flash('error', 'email đã tồn tại!');
    res.redirect(req.get('/') || '/');
    return;
  }

  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();

  res.cookie('token_user', user.token_user);
  res.redirect('/');
};

// [GET] /user/login
module.exports.login = (req, res) => {
  res.render('client/pages/user/login', {
    titlePage: 'Đăng nhập tài khoản',
  });
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({ email: email, deleted: false });
  if (!user) {
    req.flash('error', 'không tìm thấy tài khoản');
    return res.redirect('/user/login');
  }
  if (user.password !== md5(password)) {
    req.flash('error', 'mật khẩu không đúng');
    return res.redirect('/user/login');
  }
  if (user.status === 'inactive') {
    req.flash('error', 'tài khoản của bạn đã bị cấm');
    return res.redirect('/user/login');
  }

  res.cookie('token_user', user.token_user);
  res.redirect('/');
};

// [GET] /user/logout
module.exports.logout = (req, res) => {
  res.clearCookie('token_user');
  res.redirect('/');
};
