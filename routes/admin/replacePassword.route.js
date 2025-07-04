const express = require('express');
const router = express.Router();

const replacePassword = require('../../controllers/admin/replace-password.controller');
const middleware = require('../../middlewares/admin/uploadCloudinary.middleware');

router.get('/', replacePassword.index);

module.exports = router;
