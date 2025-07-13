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

module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cart_id;
  const productId = req.params.id;
  await Cart.updateOne(
    { _id: cartId },
    { $pull: { products: { products_id: productId } } }
  );
  req.flash('success', 'xóa sản phẩm khỏi giỏ hàng thành công!');
  res.redirect(req.get('Referrer') || '/');
};

// [GET] /cart/update/:product_id/:quantity
module.exports.update = async (req, res) => {
  const productId = req.params.product_id;
  const quantity = req.params.quantity;
  const cartId = req.cookies.cart_id;
  const product = await Product.findOne({ _id: productId });
  if (product.stock < quantity) {
    req.flash('error', 'số lượng sản phẩm không đủ!');
    res.redirect(req.get('Referrer') || '/');
    return;
  }
  await Cart.updateOne(
    { _id: cartId, 'products.products_id': productId },
    { $set: { 'products.$.quantity': +quantity } }
  );
  req.flash('success', 'cập nhật số lượng sản phẩm thành công!');
  res.redirect(req.get('Referrer') || '/');
};
