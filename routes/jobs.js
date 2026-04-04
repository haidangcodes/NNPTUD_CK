const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { verifyToken, checkRole } = require('../utils/authHandler');

router.get('/', jobController.getAllJobs);
router.get('/:id', jobController.getJobById);

router.use(verifyToken);

router.post('/', checkRole('RECRUITER', 'ADMIN'), jobController.createJob);
router.put('/:id', checkRole('RECRUITER', 'ADMIN'), jobController.updateJob);
router.delete('/:id', checkRole('RECRUITER', 'ADMIN'), jobController.deleteJob);
router.get('/recruiter/my-jobs', checkRole('RECRUITER'), jobController.getMyJobs);

module.exports = router;
