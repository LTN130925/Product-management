const express = require('express');
const multer = require("multer");

const upload = multer();

const router = express.Router();

const middleware = require("../../middlewares/admin/uploadCloudinary.middleware");
const productCategoryController = require('../../controllers/admin/product-category.controller');
const validate = require("../../validates/admin/product-category.validate");

router.get('/', productCategoryController.index);

router.get('/create', productCategoryController.create);

router.post(
  '/create',
  upload.single("thumbnail"),
  middleware.uploadCloudinary,
  validate.createPost,
  productCategoryController.createPost
);

module.exports = router;