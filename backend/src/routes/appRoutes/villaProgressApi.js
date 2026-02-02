const express = require('express');
const villaProgressRouter = require('../../modules/VillaProgressModule/villaProgress.routes');
const router = express.Router();

// /api/companies/:companyId/villas/:villaId/progress
router.use('/companies/:companyId/villas/:villaId/progress', villaProgressRouter);

module.exports = router;
