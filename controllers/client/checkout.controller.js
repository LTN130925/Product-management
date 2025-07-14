const Cart = require('../../models/cart.model');
const Product = require('../../models/product.model');
const Order = require('../../models/order.model');

const newPriceHelper = require('../../helper/newPrice');
const showDetailProductsHelper = require('../../helper/showDetailProducts');

// [GET] /checkout
module.exports.index = async (req, res) => {
  try {
    const cartId = req.cookies.cart_id;
    const carts = await Cart.findOne({ _id: cartId });

    const result = await showDetailProductsHelper.detail(carts);

    res.render('client/pages/checkout/index', {
      titlePage: 'Thanh toán',
      carts: result,
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

// [GET] /checkout/success/:order_id
module.exports.success = async (req, res) => {
  const order_id = req.params.order_id;
  const order = await Order.findOne({
    _id: order_id,
  });

  if (order.products.length > 0) {
    for (const item of order.products) {
      const productInfo = await Product.findOne({
        _id: item.products_id,
      }).select('thumbnail title');

      newPriceHelper.priceNewProduct(item);
      item.newPrice = +item.newPrice;
      item.productInfo = productInfo;
      item.totalPrice = item.quantity * item.newPrice;
    }
  }

  order.totalPrice = order.products.reduce((sum, item) => {
    return sum + item.totalPrice;
  }, 0);

  res.render('client/pages/checkout/success', {
    order: order,
    titlePage: 'Đặt hàng thành công',
  });
};
