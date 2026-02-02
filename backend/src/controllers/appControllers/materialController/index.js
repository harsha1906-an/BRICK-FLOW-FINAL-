const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Material');

methods.adjustStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, quantity, reference, notes, date, project, usageCategory } = req.body; // type: 'inward' or 'outward'

        if (!['inward', 'outward'].includes(type)) {
            return res.status(400).json({ success: false, message: 'Invalid transaction type' });
        }
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ success: false, message: 'Quantity must be positive' });
        }

        const Material = mongoose.model('Material');
        const InventoryTransaction = mongoose.model('InventoryTransaction');

        const material = await Material.findOne({ _id: id, removed: false });
        if (!material) {
            return res.status(404).json({ success: false, message: 'Material not found' });
        }

        // Check stock for outward
        if (type === 'outward' && material.currentStock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock. Current: ${material.currentStock} ${material.unit}`
            });
        }

        // Update Material Stock
        if (type === 'inward') {
            material.currentStock += parseFloat(quantity);
        } else {
            material.currentStock -= parseFloat(quantity);
        }
        await material.save();

        // Create Transaction Record
        await new InventoryTransaction({
            material: id,
            type,
            quantity: parseFloat(quantity),
            date: date || new Date(),
            reference,
            notes,
            project,
            usageCategory: usageCategory || 'daily_work',
            performedBy: req.admin._id,
        }).save();

        return res.status(200).json({
            success: true,
            result: material,
            message: 'Stock adjusted successfully',
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

methods.history = async (req, res) => {
    try {
        const { id } = req.params;
        const InventoryTransaction = mongoose.model('InventoryTransaction');

        const history = await InventoryTransaction.find({ material: id })
            .sort({ date: -1, created: -1 })
            .limit(50); // Limit to last 50 transactions for performance

        return res.status(200).json({
            success: true,
            result: history
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = methods;
