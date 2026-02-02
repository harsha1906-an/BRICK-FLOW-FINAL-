const express = require('express');
const attendanceRouter = require('../../modules/LabourModule/attendance.routes');
const router = express.Router();

// /api/companies/:companyId/attendance
router.use('/companies/:companyId/attendance', attendanceRouter);

module.exports = router;
