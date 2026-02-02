const mongoose = require('mongoose');
const Model = mongoose.model('PurchaseOrder');

const reject = async (req, res) => {
    const { role } = req.admin;
    if (role !== 'owner') {
        return res.status(403).json({
            success: false,
            result: null,
            message: 'Only Owners can reject Purchase Orders.',
        });
    }

    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
        return res.status(400).json({
            success: false,
            result: null,
            message: 'Reason is required for rejection.',
        });
    }

    const po = await Model.findById(id);

    if (!po) return res.status(404).json({ success: false, message: 'PO not found' });

    if (po.status !== 'submitted') {
        return res.status(400).json({ success: false, message: 'Only Submitted POs can be rejected' });
    }

    po.status = 'rejected';
    po.auditLog.push({
        status: 'rejected',
        user: req.admin._id,
        date: new Date(),
        reason: reason
    });

    const result = await po.save();

    return res.status(200).json({
        success: true,
        result,
        message: 'Purchase Order rejected',
    });
};

module.exports = reject;
