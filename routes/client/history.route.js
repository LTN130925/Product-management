const express = require('express');
const router = express.Router();

const historyController = require('../../controllers/client/history.controller');
const authMiddleware = require('../../middlewares/client/auth.middleware');

router.get('/', authMiddleware.requireAuth, historyController.index);

module.exports = router;