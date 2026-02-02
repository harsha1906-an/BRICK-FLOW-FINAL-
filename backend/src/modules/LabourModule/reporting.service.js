const mongoose = require('mongoose');
const moment = require('moment');

const generateDailySummary = async (companyId, date = new Date()) => {
    const Attendance = mongoose.model('Attendance');
    const InventoryTransaction = mongoose.model('InventoryTransaction');

    const startOfDay = moment(date).startOf('day').toDate();
    const endOfDay = moment(date).endOf('day').toDate();

    const filter = {
        companyId,
        date: { $gte: startOfDay, $lte: endOfDay }
    };

    // 1. Labour Costs (from Attendance)
    const attendance = await Attendance.find(filter);
    const totalWage = attendance.reduce((sum, a) => sum + (a.wage || 0), 0);
    const totalAdvance = attendance.reduce((sum, a) => sum + (a.advanceDeduction || 0), 0);
    const totalPenalty = attendance.reduce((sum, a) => sum + (a.penalty || 0), 0);

    // 2. Inventory Inward/Outward
    const inventory = await InventoryTransaction.find({
        date: { $gte: startOfDay, $lte: endOfDay }
    }).populate('material');

    const inwardCount = inventory.filter(i => i.type === 'inward').length;
    const outwardCount = inventory.filter(i => i.type === 'outward').length;

    // 3. Customer Collections (Stage-wise)
    const Payment = mongoose.model('Payment');
    const collections = await Payment.find({
        date: { $gte: startOfDay, $lte: endOfDay }
    });
    const totalCollections = collections.reduce((sum, p) => sum + (p.amount || 0), 0);

    // 4. Petty Cash Expenses
    const PettyCashTransaction = mongoose.model('PettyCashTransaction');
    const pettyCash = await PettyCashTransaction.find({
        date: { $gte: startOfDay, $lte: endOfDay },
        type: 'outward'
    });
    const totalPettyCash = pettyCash.reduce((sum, p) => sum + (p.amount || 0), 0);

    return {
        date: moment(date).format('DD MMM YYYY'),
        labour: {
            netWage: totalWage,
            advances: totalAdvance,
            penalties: totalPenalty,
            count: attendance.length
        },
        inventory: {
            inward: inwardCount,
            outward: outwardCount
        },
        pettyCash: {
            expense: totalPettyCash,
            count: pettyCash.length
        },
        customerCollections: totalCollections,
        totalDailyExpense: totalWage + totalPettyCash
    };
};

module.exports = { generateDailySummary };
