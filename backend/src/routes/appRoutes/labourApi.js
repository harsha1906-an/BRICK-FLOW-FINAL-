const express = require('express');
const labourRouter = require('../../modules/LabourModule/labour.routes');
const router = express.Router();

// /api/companies/:companyId/labour
router.use('/companies/:companyId/labour', labourRouter);

module.exports = router;
