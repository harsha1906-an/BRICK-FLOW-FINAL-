const express = require('express');
const router = express.Router();
const villaRoutes = require('../../modules/VillaModule/villa.routes');

// Mount at /api/companies/:companyId/villas
router.use('/companies/:companyId/villas', villaRoutes);

module.exports = router;
