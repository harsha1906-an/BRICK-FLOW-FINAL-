const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Material');

methods.adjustStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, quantity, reference, notes, date, project, usageCategory, villa, supplier } = req.body; // type: 'inward' or 'outward', villa: villaId

        if (!['inward', 'outward'].includes(type)) {
            return res.status(400).json({ success: false, message: 'Invalid transaction type' });
        }
        if (!quantity || quantity <= 0) {
            return res.status(400).json({ success: false, message: 'Quantity must be positive' });
        }

        const Material = mongoose.model('Material');
        const InventoryTransaction = mongoose.model('InventoryTransaction');
        const VillaStock = mongoose.model('VillaStock');

        const material = await Material.findOne({ _id: id, removed: false });
        if (!material) {
            return res.status(404).json({ success: false, message: 'Material not found' });
        }

        let villaStock = null;
        if (villa) {
            villaStock = await VillaStock.findOne({ villa, material: id });
            if (!villaStock) {
                // Create if not exists (only strict checking for outward if needed, but here we can allow negative or require initial inward)
                // For now, create new with 0 if not exists
                villaStock = new VillaStock({ villa, material: id, currentStock: 0 });
            }
        }

        // Check stock for outward
        // Global Stock check
        if (type === 'outward' && material.currentStock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Insufficient global stock. Current: ${material.currentStock} ${material.unit}`
            });
        }

        // Villa Stock check (optional: enforce villa level stock?)
        // Let's enforce it to prevent negative villa stock
        if (type === 'outward' && villa && villaStock) {
            if (villaStock.currentStock < quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock at Villa. Current: ${villaStock.currentStock} ${material.unit}`
                });
            }
        }


        // Update Material Stock
        if (type === 'inward') {
            if (villaStock) {
                // TRANSFER: Global -> Villa
                // Check if Global has enough stock
                if (material.currentStock < quantity) {
                    return res.status(400).json({
                        success: false,
                        message: `Insufficient global stock for transfer. Current: ${material.currentStock} ${material.unit}`
                    });
                }
                material.currentStock -= parseFloat(quantity); // Reduce Global
                villaStock.currentStock += parseFloat(quantity); // Increase Villa
                villaStock.lastUpdated = Date.now();
                await villaStock.save();
            } else {
                // PURCHASE: External -> Global
                material.currentStock += parseFloat(quantity);
            }
        } else {
            // OUTWARD (Consumption)
            if (villaStock) {
                // Consume from Villa
                villaStock.currentStock -= parseFloat(quantity);
                villaStock.lastUpdated = Date.now();
                await villaStock.save();
                // Do NOT reduce Global (Material.currentStock) because it was already reduced during Transfer
            } else {
                // Consume from Global directly
                material.currentStock -= parseFloat(quantity);
            }
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
            villa,
            supplier,
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

methods.downloadReport = async (req, res) => {
    try {
        console.log("Download Report Request Received", req.query);
        const { startDate, endDate, villa } = req.query;
        const InventoryTransaction = mongoose.model('InventoryTransaction');
        const Villa = mongoose.model('Villa');
        const pdfController = require('@/controllers/pdfController');

        console.log("Download Param - Start:", startDate, "End:", endDate, "Villa:", villa);

        const query = {
            removed: { $ne: true },
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        };

        if (villa && villa !== 'all') {
            query.villa = villa;
        }

        console.log("Fetching transactions with query:", query);
        const transactions = await InventoryTransaction.find(query)
            .populate('material')
            .populate('villa')
            .sort({ date: 1 });

        console.log("Found transactions:", transactions.length);

        const villaObj = (villa && villa !== 'all') ? await Villa.findById(villa) : null;

        const model = {
            startDate,
            endDate,
            villa: villaObj,
            items: transactions
        };

        const filename = `InventoryReport_${Date.now()}.pdf`;
        const targetLocation = `src/public/download/${filename}`;

        console.log("Generating PDF at:", targetLocation);
        await pdfController.generatePdf(
            'InventoryReport',
            { filename, format: 'A4', targetLocation },
            model,
            () => {
                console.log("PDF Generated successfully. Sending file...");
                return res.download(targetLocation, (error) => {
                    if (error) {
                        console.error("Error sending file:", error);
                        res.status(500).json({ success: false, message: "Error downloading file" });
                    } else {
                        console.log("File sent successfully.");
                    }
                });
            }
        );

    } catch (error) {
        console.error("Download Report Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = methods;
