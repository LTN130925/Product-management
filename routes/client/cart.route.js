const express = require('express');
const route = express.Router();

const controller = require('../../controllers/client/cart.controller');

route.get('/', controller.index);

route.post('/add/:product_id', controller.addPost);

route.get('/delete/:id', controller.delete);

route.get('/update/:product_id/:quantity', controller.update);

module.exports = route;
