const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('PettyCashTransaction');

const summary = require('./summary');

methods.summary = summary;

module.exports = methods;
