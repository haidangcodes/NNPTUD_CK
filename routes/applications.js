const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { verifyToken, checkRole } = require('../utils/authHandler');

router.use(verifyToken);

router.post('/', checkRole('CANDIDATE'), applicationController.applyToJob);
router.get('/me', checkRole('CANDIDATE'), applicationController.getMyApplications);
router.get('/job/:jobId', checkRole('RECRUITER', 'ADMIN'), applicationController.getApplicationsByJob);
router.put('/:id/status', checkRole('RECRUITER', 'ADMIN'), applicationController.updateApplicationStatus);
router.get('/:id', applicationController.getApplicationById);
router.delete('/:id', applicationController.deleteApplication);

module.exports = router;
