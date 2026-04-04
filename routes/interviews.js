const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { verifyToken, checkRole } = require('../utils/authHandler');

router.use(verifyToken);

router.post('/', checkRole('RECRUITER', 'ADMIN'), interviewController.createInterview);
router.get('/me', interviewController.getMyInterviews);
router.get('/application/:applicationId', interviewController.getInterviewsByApplication);
router.put('/:id', checkRole('RECRUITER', 'ADMIN'), interviewController.updateInterview);
router.delete('/:id', checkRole('RECRUITER', 'ADMIN'), interviewController.deleteInterview);

module.exports = router;
