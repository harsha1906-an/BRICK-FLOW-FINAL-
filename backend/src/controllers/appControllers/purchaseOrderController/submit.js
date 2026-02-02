const mongoose = require('mongoose');
const Model = mongoose.model('PurchaseOrder');

const submit = async (req, res) => {
    const { role } = req.admin;
    if (role !== 'engineer') {
        return res.status(403).json({
            success: false,
            result: null,
            message: 'Only Engineers can submit Purchase Orders.',
        });
    }

    const { id } = req.params; // or req.body
    const po = await Model.findById(id);

    if (!po) return res.status(404).json({ success: false, message: 'PO not found' });

    if (po.status !== 'draft') {
        return res.status(400).json({ success: false, message: 'Only Draft POs can be submitted' });
    }

    po.status = 'submitted';
    po.auditLog.push({
        status: 'submitted',
        user: req.admin._id,
        date: new Date(),
        reason: 'Submitted for approval'
    });

    const result = await po.save();

    return res.status(200).json({
        success: true,
        result,
        message: 'Purchase Order submitted successfully',
    });
};

module.exports = submit;
