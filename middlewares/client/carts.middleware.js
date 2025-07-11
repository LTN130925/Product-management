const Cart = require('../../models/cart.models');

module.exports.cartId = async (req, res, next) => {
  if (!req.cookies.cart_id) {
    const cart = new Cart();
    await cart.save();

    const expiresCookies = 1000 * 60 * 60 * 24 * 60;

    res.cookie('cart_id', cart.id, {
      expires: new Date(Date.now() + expiresCookies),
    });
  } else {
    const cart = await Cart.findOne({
      _id: req.cookies.cart_id,
    });

    const totalQuality = cart.products.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    res.locals.totalQuality = totalQuality;
  }

  next();
};
