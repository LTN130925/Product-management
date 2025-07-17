const express = require('express');
const route = express.Router();

const controller = require('../../controllers/client/user.controller');
const validates = require('../../validates/client/user.validate');

route.get('/register', controller.register);

route.post('/register', validates.registerPost, controller.registerPost);

route.get('/login', controller.login);

route.post('/login', validates.loginPost, controller.loginPost);

route.get('/logout', controller.logout);

route.get('/password/forgot', controller.forgot);

route.post('/password/forgot', controller.forgotPost);

route.get('/password/otp', controller.otpPassword);

route.post('/password/otp', controller.otpPasswordPost);

route.get('/password/reset', controller.resetPassword);

route.post('/password/reset', validates.resetPasswordPost, controller.resetPasswordPost);

module.exports = route;
