const mongoose = require('mongoose');
const InvoiceUpdate = mongoose.model('InvoiceUpdate');

const rejectUpdate = async (req, res) => {
    // Check if user is Owner
    if (req.admin.role !== 'owner') {
        return res.status(403).json({
            success: false,
            message: 'Access Denied: Only Owners can reject updates',
        });
    }

    const { reason } = req.body;

    const updateRequest = await InvoiceUpdate.findByIdAndUpdate(
        req.params.id,
        {
            status: 'rejected',
            reason: reason || 'Rejected by Owner',
        },
        { new: true }
    );

    if (!updateRequest) {
        return res.status(404).json({
            success: false,
            message: 'Update request not found',
        });
    }

    return res.status(200).json({
        success: true,
        result: updateRequest,
        message: 'Invoice Update Rejected',
    });
};

module.exports = rejectUpdate;
