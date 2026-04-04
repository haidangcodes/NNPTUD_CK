const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { verifyToken, checkRole } = require('../utils/authHandler');

router.use(verifyToken);

router.get('/me', checkRole('RECRUITER'), companyController.getMyCompany);
router.post('/me', checkRole('RECRUITER'), companyController.createOrUpdateMyCompany);
router.put('/me', checkRole('RECRUITER'), companyController.createOrUpdateMyCompany);
router.get('/', companyController.getAllCompanies);
router.get('/:id', companyController.getCompanyById);

router.put('/:id/approve', checkRole('ADMIN'), companyController.approveCompany);
router.put('/:id/reject', checkRole('ADMIN'), companyController.rejectCompany);
router.delete('/:id', checkRole('RECRUITER', 'ADMIN'), companyController.deleteCompany);

module.exports = router;
