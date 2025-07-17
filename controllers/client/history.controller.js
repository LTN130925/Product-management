const Order = require('../../models/order.model');

const helperNewProducts = require('../../helper/newPrice');

module.exports.index = async (req, res) => {
  if (!res.locals.user) {
    req.flash('error', 'Vui lòng đăng nhập để xem lịch sử đơn hàng');
    return res.redirect('/user/login');
  }

  const orders = await Order.find({
    deleted: false,
  });

  if (orders.length > 0) {
    for (const order of orders) {
      for (const product of order.products) {
        helperNewProducts.priceNewProduct(product);
        product.newPrice = +product.newPrice;
        product.totalPrice = product.newPrice * product.quantity;
      }
      order.totalPrice = order.products.reduce((sum, item) => {
        return sum + item.totalPrice;
      }, 0);
    }
  }

  res.render('client/pages/history/index', {
    titlePage: 'Lịch sử đơn hàng',
    orders: orders,
  });
};
