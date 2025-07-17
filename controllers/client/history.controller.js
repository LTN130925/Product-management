const Order = require('../../models/order.model');

const showCheckoutHelper = require('../../helper/showCheckout');

module.exports.index = async (req, res) => {
  if (!res.locals.user) {
    req.flash('error', 'Vui lòng đăng nhập để xem lịch sử đơn hàng');
    return res.redirect('/user/login');
  }

  const orders = await Order.find({
    deleted: false,
  });

  showCheckoutHelper.showCheckout(orders);

  res.render('client/pages/history/index', {
    titlePage: 'Lịch sử đơn hàng',
    orders: orders,
  });
};
