const Cart = require('../../models/cart.model');

module.exports.cartId = async (req, res, next) => {
  try {
    let cart = null;
    if (req.cookies.cart_id) {
      cart = await Cart.findOne({ _id: req.cookies.cart_id });
    }

    if (!cart) {
      if (req.cookies.cart_created_recently) {
        return res.status(429).send('Bạn vừa tạo giỏ hàng, vui lòng chờ một lát rồi thử lại!');
      }
      cart = new Cart();
      await cart.save();
      res.cookie('cart_id', cart.id, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        httpOnly: true,
      });

      res.cookie('cart_created_recently', '1', {
        maxAge: 30 * 1000,
        httpOnly: true,
      });
    }

    const totalQuality = cart.products.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    res.locals.totalQuality = totalQuality;
  } catch (error) {
    console.error('Error in cart middleware:', error.message);
    res.locals.totalQuality = 0;
  }

  next();
};
