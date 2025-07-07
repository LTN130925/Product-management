const express = require('express');

const validateSlug = require('../../validates/client/slug.validate');
const controllerProduct = require('../../controllers/client/product.controller');

const route = express.Router();

route.get('/', controllerProduct.index);

route.get('/detail/:slug', validateSlug.slugCheck, controllerProduct.detail);

route.get('/:slug_category', controllerProduct.slugCategory);

module.exports = route;
