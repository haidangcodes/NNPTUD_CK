const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { verifyToken, checkRole } = require('../utils/authHandler');

router.use(verifyToken);

router.get('/me', profileController.getMyProfile);
router.put('/me', checkRole('CANDIDATE', 'ADMIN'), profileController.updateMyProfile);

module.exports = router;
