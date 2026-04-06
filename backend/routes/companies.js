const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { verifyToken, checkRole } = require('../utils/authHandler');

// IMPORTANT: /me routes MUST come BEFORE /:id to avoid "me" being matched as an id
router.get('/me', verifyToken, checkRole('TUYEN_DUNG'), companyController.getMyCompany);
router.post('/me', verifyToken, checkRole('TUYEN_DUNG'), companyController.createOrUpdateMyCompany);
router.put('/me', verifyToken, checkRole('TUYEN_DUNG'), companyController.createOrUpdateMyCompany);

// Public routes
router.get('/', companyController.getAllCompanies);
router.get('/:id', companyController.getCompanyById);

// Admin routes
router.put('/:id/approve', checkRole('QUAN_TRI'), companyController.approveCompany);
router.put('/:id/reject', checkRole('QUAN_TRI'), companyController.rejectCompany);
router.put('/:id/lock', checkRole('QUAN_TRI'), companyController.lockCompany);
router.delete('/:id', checkRole('TUYEN_DUNG', 'QUAN_TRI'), companyController.deleteCompany);

module.exports = router;