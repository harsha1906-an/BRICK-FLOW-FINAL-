const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Invoice');

const sendMail = require('./sendMail');
const create = require('./create');
const summary = require('./summary');
const update = require('./update');
const approveUpdate = require('./approveUpdate');
const rejectUpdate = require('./rejectUpdate');
const remove = require('./remove');
const paginatedList = require('./paginatedList');
const read = require('./read');

methods.mail = sendMail;
methods.create = create;
methods.update = update;
methods.approveUpdate = approveUpdate;
methods.rejectUpdate = rejectUpdate;
methods.delete = remove;
methods.summary = summary;
methods.list = paginatedList;
methods.read = read;

module.exports = methods;
