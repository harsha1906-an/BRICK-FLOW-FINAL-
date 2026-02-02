const mongoose = require('mongoose');
const Model = mongoose.model('PurchaseOrder');
const { increaseBySettingKey } = require('@/middlewares/settings');

const create = async (req, res) => {
    const { role } = req.admin;
    if (role !== 'engineer') {
        return res.status(403).json({
            success: false,
            result: null,
            message: 'Only Engineers can create Purchase Orders.',
        });
    }

    const { items = [], vendor, number } = req.body;

    let subTotal = 0;
    let taxTotal = 0; // Assuming 0 for now or passed in
    let total = 0;

    items.forEach((item) => {
        item.amount = item.quantity * item.price;
        subTotal += item.amount;
    });

    total = subTotal + taxTotal;

    let body = req.body;
    body.details = items;
    body.status = 'draft';
    body.createdBy = req.admin._id;
    body.total = total;
    body.auditLog = [
        {
            status: 'draft',
            user: req.admin._id,
            date: new Date(),
            reason: 'Initial Draft'
        }
    ];

    const result = await new Model(body).save();

    // increaseBySettingKey({ settingKey: 'last_po_number' }); // Optional: if we want auto-increment

    return res.status(200).json({
        success: true,
        result: result,
        message: 'Purchase Order created successfully',
    });
};

module.exports = create;
