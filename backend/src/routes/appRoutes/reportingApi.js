const express = require('express');
const router = express.Router();
const { generateDailySummary } = require('@/modules/LabourModule/reporting.service');
const { catchErrors } = require('@/handlers/errorHandlers');

router.get('/companies/:companyId/daily-summary', catchErrors(async (req, res) => {
    const { date } = req.query;
    const { companyId } = req.params;
    const summary = await generateDailySummary(companyId, date);
    res.json(summary);
}));

module.exports = router;
