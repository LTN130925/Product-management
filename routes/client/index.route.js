const productRoutes = require('./product.route');
const homeRoutes = require('./home.route');
const searchRoutes = require('./searchRoutes.route');

const middlewareProductsCategory = require('../../middlewares/client/categoryMiddleware.middleware');

module.exports = (app) => {
  app.use(middlewareProductsCategory.layoutProductsCategory);

  app.use('/', homeRoutes);

  app.use('/products', productRoutes);

  app.use('/search', searchRoutes);
};
