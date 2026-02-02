const mongoose = require('mongoose');
const Model = mongoose.model('PurchaseOrder');

const approve = async (req, res) => {
    const { role } = req.admin;
    if (role !== 'owner') {
        return res.status(403).json({
            success: false,
            result: null,
            message: 'Only Owners can approve Purchase Orders.',
        });
    }

    const { id } = req.params;
    const po = await Model.findById(id);

    if (!po) return res.status(404).json({ success: false, message: 'PO not found' });

    if (po.status !== 'submitted') {
        return res.status(400).json({ success: false, message: 'Only Submitted POs can be approved' });
    }

    po.status = 'approved';
    po.auditLog.push({
        status: 'approved',
        user: req.admin._id,
        date: new Date(),
        reason: 'Approved by Owner'
    });

    const result = await po.save();

    return res.status(200).json({
        success: true,
        result,
        message: 'Purchase Order approved successfully',
    });
};

module.exports = approve;
