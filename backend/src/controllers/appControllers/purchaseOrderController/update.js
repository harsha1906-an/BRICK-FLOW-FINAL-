const mongoose = require('mongoose');
const Model = mongoose.model('PurchaseOrder');

const update = async (req, res) => {
    const { role } = req.admin;
    if (role !== 'engineer') {
        return res.status(403).json({
            success: false,
            result: null,
            message: 'Only Engineers can update Purchase Orders.',
        });
    }

    const { id } = req.params;
    const currentPO = await Model.findById(id);

    if (!currentPO) {
        return res.status(404).json({
            success: false,
            result: null,
            message: 'Purchase Order not found.',
        });
    }

    if (currentPO.status !== 'draft') {
        return res.status(403).json({
            success: false,
            result: null,
            message: 'Cannot update Purchase Order unless it is in Draft status.',
        });
    }

    const { items = [] } = req.body;
    let subTotal = 0;
    let total = 0;

    if (items.length > 0) {
        items.forEach((item) => {
            item.amount = item.quantity * item.price;
            subTotal += item.amount;
        });
        total = subTotal;
        req.body.details = items;
        req.body.total = total;
    }

    const result = await Model.findOneAndUpdate(
        { _id: id },
        req.body,
        { new: true, runValidators: true }
    ).exec();

    return res.status(200).json({
        success: true,
        result: result,
        message: 'Purchase Order updated successfully',
    });
};

module.exports = update;
