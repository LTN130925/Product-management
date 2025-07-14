const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');
const Order = require('../../models/order.model');

const newPriceHelper = require('../../helper/newPrice');

// [GET] /checkout
module.exports.index = async (req, res) => {
  try {
    const cartId = req.cookies.cart_id;
    const carts = await Cart.findOne({ _id: cartId });
    if (carts.products.length > 0) {
      for (let cart of carts.products) {
        const product = await Product.findOne({ _id: cart.products_id }).select(
          'thumbnail title price slug discountPercentage'
        );
        newPriceHelper.priceNewProduct(product);
        product.newPrice = +product.newPrice;
        cart.productInfo = product;
        cart.totalPrice = cart.productInfo.newPrice * cart.quantity;
      }
    }

    carts.totalPrice = carts.products.reduce((total, cart) => {
      return total + cart.totalPrice;
    }, 0);

    res.render('client/pages/checkout/index', {
      titlePage: 'Thanh toán',
      carts: carts,
    });
  } catch (error) {
    req.flash('error', 'Lỗi khi lấy giỏ hàng');
    res.redirect('/');
  }
};

// [POST] /checkout/order
module.exports.order = async (req, res) => {
  try {
    const userInfo = req.body;
    const cartId = req.cookies.cart_id;

    const cart = await Cart.findOne({ _id: cartId });
    const products = [];
    for (const product of cart.products) {
      const objectProduct = {
        products_id: product.products_id,
        quantity: product.quantity,
      };
      const productInfo = await Product.findOne({
        _id: product.products_id,
      }).select('price discountPercentage');
      objectProduct.price = productInfo.price;
      objectProduct.discountPercentage = productInfo.discountPercentage;

      products.push(objectProduct);
    }

    const orderInfo = {
      cart_id: cartId,
      userInfo: userInfo,
      products: products,
    };

    const order = new Order(orderInfo);
    await order.save();

    await Cart.updateOne({ _id: cartId }, { products: [] });
    req.flash('success', 'Đặt hàng thành công');
    res.redirect(`/checkout/success/${order.id}`);
  } catch (error) {
    req.flash('error', 'Đặt hàng thất bại');
    res.redirect('/checkout');
  }
};
