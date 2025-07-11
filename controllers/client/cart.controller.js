const Cart = require('../../models/cart.models');

module.exports.addPost = async (req, res) => {
  try {
    const product_id = req.params.product_id;
    const quantity = +req.body.quantity;
    const cartId = req.cookies.cart_id;

    const carts = await Cart.findOne({ _id: cartId });
    const exitsCart = carts.products.find(
      (item) => item.products_id === product_id
    );
    if (exitsCart) {
      const newQuantity = quantity + exitsCart.quantity;
      console.log(newQuantity);
      await Cart.updateOne(
        {
          _id: cartId,
          'products.products_id': product_id,
        },
        {
          $set: { 'products.$.quantity': newQuantity },
        }
      );
    } else {
      const objectProduct = {
        products_id: product_id,
        quantity: quantity,
      };
      await Cart.updateOne(
        { _id: cartId },
        { $push: { products: objectProduct } }
      );
    }
    req.flash('success', 'thêm vô giỏ hàng thành công!');
  } catch (error) {
    req.flash('error', 'thêm vô giỏ hàng thất bại!');
  }
  res.redirect(req.get('Referrer') || '/');
};
