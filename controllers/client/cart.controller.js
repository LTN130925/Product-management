const Cart = require('../../models/cart.models');
const Product = require('../../models/product.model');

const newPriceHelper = require('../../helper/newPrice');

// [GET] /cart
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cart_id;
  const carts = await Cart.findOne({ _id: cartId });
  if (carts.products.length > 0) {
    for (let cart of carts.products) {
      const product = await Product.findOne({ _id: cart.products_id }).select(
        'thumbnail title price slug discountPercentage'
      );
      product.newPrice = newPriceHelper.priceNewProduct(product);
      cart.productInfo = product;
      cart.totalPrice = cart.productInfo.newPrice * cart.quantity;
    }
  }

  carts.totalPrice = carts.products.reduce((total, cart) => {
    return total + cart.totalPrice;
  }, 0);

  res.render('client/pages/cart/index', {
    titlePage: 'Giỏ hàng',
    carts: carts,
  });
};

// [POST] /cart/add/:product_id
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
