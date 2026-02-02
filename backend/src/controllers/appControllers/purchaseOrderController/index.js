const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('PurchaseOrder');

const create = require('./create');
const update = require('./update');
const submit = require('./submit');
const approve = require('./approve');
const reject = require('./reject');

methods.create = create;
methods.update = update;
methods.submit = submit;
methods.approve = approve;
methods.reject = reject;

module.exports = methods;
