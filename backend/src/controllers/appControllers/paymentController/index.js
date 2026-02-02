
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
methods.create = [enforceVillaOnPaymentCreate, create];
// Wrap blockPaymentEditDelete to log blocked attempts
async function blockAndAudit(req, res, next) {
	// blockPaymentEditDelete is assumed to call next() if allowed, or send response if blocked
	let responded = false;
	const originalSend = res.send;
	res.send = function (...args) {
		responded = true;
		return originalSend.apply(this, args);
	};
	await blockPaymentEditDelete(req, res, function () {
		if (!responded) next();
	});
	if (responded) {
		// Blocked: log attempt
		logAuditAction({
			req,
			module: 'payment',
			action: 'attempt',
			entityType: 'Payment',
			entityId: req.params.id,
			metadata: { operation: req.method }
		});
	}
}
methods.update = [blockAndAudit, update];
methods.delete = [blockAndAudit, remove];
methods.summary = summary;

module.exports = methods;
