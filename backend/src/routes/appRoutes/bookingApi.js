const express = require('express');
const router = express.Router();
const bookingRoutes = require('../../modules/BookingModule/booking.routes');

// Mount at /api/booking (singular 'booking' to match entity name)
router.use('/booking', bookingRoutes);

module.exports = router;
