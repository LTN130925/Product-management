const productRoutes = require('./product.route');
const homeRoutes = require('./home.route');
const searchRoutes = require('./searchRoutes.route');
const cartRoutes = require('./cart.route');
const blogRoutes = require('./blog.route');

const middlewareProductsCategory = require('../../middlewares/client/categoryMiddleware.middleware');
const middlewareCarts = require('../../middlewares/client/carts.middleware');

module.exports = (app) => {
  app.use(middlewareProductsCategory.layoutProductsCategory);

  app.use(middlewareCarts.cartId);

  app.use('/', homeRoutes);

  app.use('/products', productRoutes);

  app.use('/search', searchRoutes);

  app.use('/cart', cartRoutes);

  app.use('/blogs', blogRoutes);
};
