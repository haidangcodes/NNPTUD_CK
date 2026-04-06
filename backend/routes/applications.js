const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { verifyToken, checkRole } = require('../utils/authHandler');

router.use(verifyToken);

router.post('/', checkRole('UNG_VIEN'), applicationController.applyToJob);
router.get('/me', checkRole('UNG_VIEN'), applicationController.getMyApplications);
router.get('/job/:jobId', checkRole('TUYEN_DUNG', 'QUAN_TRI'), applicationController.getApplicationsByJob);
router.put('/:id/status', checkRole('TUYEN_DUNG', 'QUAN_TRI'), applicationController.updateApplicationStatus);
router.get('/:id', applicationController.getApplicationById);
router.delete('/:id', applicationController.deleteApplication);

module.exports = router;