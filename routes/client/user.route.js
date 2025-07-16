const express = require('express');
const route = express.Router();

const controller = require('../../controllers/client/user.controller');
const validates = require('../../validates/client/user.validate');

route.get('/register', controller.register);

route.post('/register', validates.registerPost, controller.registerPost);

route.get('/login', controller.login);

route.post('/login', validates.loginPost, controller.loginPost);

module.exports = route;
