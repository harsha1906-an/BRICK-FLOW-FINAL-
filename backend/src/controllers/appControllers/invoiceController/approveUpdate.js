const mongoose = require('mongoose');

const Invoice = mongoose.model('Invoice');
const InvoiceUpdate = mongoose.model('InvoiceUpdate');

const { calculate } = require('@/helpers');

const approveUpdate = async (req, res) => {
    // Check if user is Owner
    if (req.admin.role !== 'owner') {
        return res.status(403).json({
            success: false,
            message: 'Access Denied: Only Owners can approve updates',
        });
    }

    const updateRequest = await InvoiceUpdate.findById(req.params.id);

    if (!updateRequest) {
        return res.status(404).json({
            success: false,
            message: 'Update request not found',
        });
    }

    if (updateRequest.status !== 'pending') {
        return res.status(400).json({
            success: false,
            message: `Request is already ${updateRequest.status}`,
        });
    }

    const { invoice: invoiceId, requestedChanges } = updateRequest;

    // Find document by id and updates with the required fields
    const previousInvoice = await Invoice.findOne({
        _id: invoiceId,
        removed: false,
    });

    if (!previousInvoice) {
        return res.status(404).json({
            success: false,
            message: 'Original Invoice not found',
        });
    }

    const { items = [], taxRate = 0, discount = 0 } = requestedChanges;

    // Recalculate logic (duplicated from update.js)
    let subTotal = 0;
    let taxTotal = 0;
    let total = 0;

    items.map((item) => {
        let total = calculate.multiply(item['quantity'], item['price']);
        subTotal = calculate.add(subTotal, total);
        item['total'] = total;
    });
    taxTotal = calculate.multiply(subTotal, taxRate / 100);
    total = calculate.add(subTotal, taxTotal);

    const body = {
        ...requestedChanges,
        subTotal,
        taxTotal,
        total,
        items,
        pdf: 'invoice-' + invoiceId + '.pdf',
    };

    if (body.hasOwnProperty('currency')) {
        delete body.currency;
    }

    // Determine payment status based on credit already paid
    const { credit } = previousInvoice;
    let paymentStatus =
        calculate.sub(total, discount) === credit ? 'paid' : credit > 0 ? 'partially' : 'unpaid';
    body['paymentStatus'] = paymentStatus;

    const result = await Invoice.findOneAndUpdate({ _id: invoiceId, removed: false }, body, {
        new: true,
    }).exec();

    // Mark Request as Approved
    updateRequest.status = 'approved';
    await updateRequest.save();

    return res.status(200).json({
        success: true,
        result,
        message: 'Invoice Update Approved and Applied',
    });
};

module.exports = approveUpdate;
