const express = require('express');
const router = express.Router();
const bookingController = require('./booking.controller');

// Matches appApi.js patterns
router.post('/create', bookingController.create);
router.get('/list', bookingController.list);
router.get('/listAll', bookingController.listAll);
router.get('/read/:id', bookingController.read);
router.patch('/update/:id', bookingController.update);
router.get('/search', bookingController.search);
router.get('/filter', bookingController.filter);
router.get('/summary', bookingController.summary);
// router.delete('/delete/:id', bookingController.delete);

module.exports = router;
