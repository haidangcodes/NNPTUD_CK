const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { verifyToken, checkRole } = require('../utils/authHandler');

router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);

router.use(verifyToken);

router.post('/', checkRole('TUYEN_DUNG', 'QUAN_TRI'), jobController.createJob);
router.put('/:id', checkRole('TUYEN_DUNG', 'QUAN_TRI'), jobController.updateJob);
router.delete('/:id', checkRole('TUYEN_DUNG', 'QUAN_TRI'), jobController.deleteJob);
router.get('/recruiter/my-jobs', checkRole('TUYEN_DUNG'), jobController.getMyJobs);

module.exports = router;