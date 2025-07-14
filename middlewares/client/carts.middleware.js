const Cart = require('../../models/cart.model');

module.exports.cartId = async (req, res, next) => {
  try {
    if (!req.cookies.cart_id) {
      const cart = new Cart();
      await cart.save();
      
      const expiresCookies = 1000 * 60 * 60 * 24 * 60;
      
      res.cookie('cart_id', cart.id, {
        expires: new Date(Date.now() + expiresCookies),
        httpOnly: true,
      });
      res.locals.totalQuality = 0;
    } else {
      const cart = await Cart.findOne({
        _id: req.cookies.cart_id,
      });
      
      if (!cart) {
        const newCart = new Cart();
        await newCart.save();
        
        const expiresCookies = 1000 * 60 * 60 * 24 * 60;
        res.cookie('cart_id', newCart.id, {
          expires: new Date(Date.now() + expiresCookies),
          httpOnly: true,
          secure: false,
        });
        
        res.locals.totalQuality = 0;
      } else {
        const totalQuality = cart.products.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        res.locals.totalQuality = totalQuality;
      }
    }
  } catch (error) {
    console.error('Error in cart middleware:', error.message);
    res.locals.totalQuality = 0;
  }

  next();
};
