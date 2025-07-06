const productRoutes = require('./product.route');
const homeRoutes = require('./home.route');

const middlewareProductsCategory = require('../../middlewares/client/categoryMiddleware.middleware');

module.exports = (app) => {
  app.use(middlewareProductsCategory.layoutProductsCategory);

  app.use('/', homeRoutes);

  app.use('/products', productRoutes);
};
