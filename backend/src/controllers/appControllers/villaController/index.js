const Villa = require('@/models/appModels/Villa');
const fs = require('fs');
const path = require('path');

const create = async (req, res) => {
    try {
        const body = req.body;
        console.log('Creating Villa with body:', body);
        if (req.admin && req.admin.companyId) {
            body.companyId = req.admin.companyId;
        }
        const villa = new Villa(body);
        await villa.save();
        return res.status(200).json({ success: true, result: villa, message: 'Villa created successfully' });
    } catch (error) {
        console.error('Create Villa Error:', error);
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Villa number already exists.', error: error.message });
        }
        return res.status(500).json({ success: false, message: 'Failed to create villa', error: error.message });
    }
};

const list = async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = parseInt(req.query.items) || 10;
        const skip = page * limit - limit;

        // Simple filter support
        const { status, q, projectId } = req.query;
        let query = { removed: false };
        if (status) query.status = status;
        if (projectId) query.projectId = projectId;
        if (q) {
            query.villaNumber = { $regex: q, $options: 'i' };
        }

        const villas = await Villa.find(query)
            .populate('projectId', 'name') // Populate project details
            .sort({ created: -1 })
            .skip(skip)
            .limit(limit);

        const count = await Villa.countDocuments(query);
        const pages = Math.ceil(count / limit);

        try {
            const logPath = path.join(process.cwd(), 'list_debug.txt');
            const logMessage = `[${new Date().toISOString()}] List Query: ${JSON.stringify(query)}\nFound: ${villas.length}\n`;
            fs.appendFileSync(logPath, logMessage);
        } catch (e) {
            console.error('Failed to log list', e);
        }

        return res.status(200).json({
            success: true,
            result: villas,
            pagination: { page, pages, count }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to list villas', error: error.message });
    }
};

const read = async (req, res) => {
    try {
        const { id } = req.params;
        const villa = await Villa.findOne({ _id: id, removed: false });
        if (!villa) {
            return res.status(404).json({ success: false, message: 'Villa not found' });
        }
        return res.status(200).json({ success: true, result: villa });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to read villa', error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const villa = await Villa.findOneAndUpdate(
            { _id: id, removed: false },
            updates,
            { new: true, runValidators: true }
        );
        if (!villa) {
            return res.status(404).json({ success: false, message: 'Villa not found' });
        }
        return res.status(200).json({ success: true, result: villa, message: 'Villa updated successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to update villa', error: error.message });
    }
};

const deleteController = async (req, res) => {
    try {
        const { id } = req.params;
        const villa = await Villa.findOneAndUpdate(
            { _id: id, removed: false },
            { removed: true },
            { new: true }
        );
        if (!villa) {
            return res.status(404).json({ success: false, message: 'Villa not found' });
        }
        return res.status(200).json({ success: true, result: villa, message: 'Villa deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to delete villa', error: error.message });
    }
};

const search = async (req, res) => {
    const { q } = req.query;
    try {
        const regex = new RegExp(q, 'i');
        const villas = await Villa.find({
            removed: false,
            $or: [{ villaNumber: regex }, { houseType: regex }]
        }).limit(20);
        return res.status(200).json({ success: true, result: villas });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Search failed' });
    }
};

const filter = async (req, res) => {
    return list(req, res);
};

const listAll = async (req, res) => {
    try {
        const villas = await Villa.find({ removed: false }).sort({ created: -1 });
        return res.status(200).json({ success: true, result: villas, pagination: { page: 1, pages: 1, count: villas.length } });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to list all villas', error: error.message });
    }
};

const summary = async (req, res) => {
    return res.status(200).json({ success: true, result: [] });
}

module.exports = {
    create,
    list,
    read,
    update,
    delete: deleteController,
    search,
    filter,
    listAll,
    summary
};
