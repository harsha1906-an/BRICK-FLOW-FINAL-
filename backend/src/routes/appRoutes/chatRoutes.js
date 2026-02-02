const express = require('express');
const router = express.Router();
const chatController = require('@/controllers/appControllers/chatController');
const { catchErrors } = require('@/handlers/errorHandlers');

router.post('/query', catchErrors(chatController.search));

module.exports = router;
