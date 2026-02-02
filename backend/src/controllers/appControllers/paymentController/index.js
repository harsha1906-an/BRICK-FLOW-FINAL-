
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Payment');

const create = require('./create');
const summary = require('./summary');
const update = require('./update');
const remove = require('./remove');
const sendMail = require('./sendMail');

// BrickFlow payment guards

const { blockPaymentEditDelete, enforceVillaOnPaymentCreate } = require('@/middlewares/paymentBrickflowGuards');
const { logAuditAction } = require('../../../modules/AuditLogModule');

methods.mail = sendMail;
methods.create = create;
methods.update = update;
methods.delete = remove;
methods.summary = summary;

module.exports = methods;
