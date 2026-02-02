const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Booking');

const customController = require('@/modules/BookingModule/booking.controller');

Object.assign(methods, customController);

module.exports = methods;
