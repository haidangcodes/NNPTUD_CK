const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { verifyToken, checkRole } = require('../utils/authHandler');

router.use(verifyToken);

router.post('/', checkRole('TUYEN_DUNG', 'QUAN_TRI'), interviewController.createInterview);
router.get('/me', interviewController.getMyInterviews);
router.get('/application/:applicationId', interviewController.getInterviewsByApplication);
router.put('/:id', checkRole('TUYEN_DUNG', 'QUAN_TRI'), interviewController.updateInterview);
router.delete('/:id', checkRole('TUYEN_DUNG', 'QUAN_TRI'), interviewController.deleteInterview);
router.post('/:id/notes', checkRole('TUYEN_DUNG', 'QUAN_TRI'), interviewController.addInterviewNote);

module.exports = router;