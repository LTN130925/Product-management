const dashboardRoutes = require('./dashboard.route');
const productRoutes = require('./product.route');
const productCategoryRoutes = require('./products-category.route');
const rolesRoutes = require('./role.route');
const accountsRoutes = require('./accounts.route');
const authRoutes = require('./auth.route');

const systemConfig = require('../../config/system');

module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(PATH_ADMIN + '/dashboard', dashboardRoutes);

  app.use(PATH_ADMIN + '/products', productRoutes);

  app.use(PATH_ADMIN + '/products-category', productCategoryRoutes);

  app.use(PATH_ADMIN + '/roles', rolesRoutes);

  app.use(PATH_ADMIN + '/accounts', accountsRoutes);

  app.use(PATH_ADMIN + '/auth', authRoutes);

};
