module.exports.createPost = (req, res, next) => {
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

  next();
};

module.exports.editPatch = (req, res, next) => {
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

  next();
};
