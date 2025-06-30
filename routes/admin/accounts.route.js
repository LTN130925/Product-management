const express = require('express');
const multer = require('multer');

const upload = multer();
const router = express.Router();

const accountsController = require('../../controllers/admin/accounts.controller');
const middleware = require('../../middlewares/admin/uploadCloudinary.middleware');
const validate = require('../../validates/admin/accounts.validate');

router.get('/', accountsController.index);

router.get('/create', accountsController.create);

router.post(
  '/create',
  upload.single('avatar'),
  middleware.uploadCloudinary,
  validate.createPost,
  accountsController.createPost
);

module.exports = router;
