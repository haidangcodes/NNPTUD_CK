const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { verifyToken, checkRole } = require('../utils/authHandler');

router.use(verifyToken);

router.get('/me', profileController.getMyProfile);
router.put('/me', checkRole('UNG_VIEN', 'QUAN_TRI'), profileController.updateMyProfile);
router.get('/user/:userId', profileController.getProfileByUserId);
router.delete('/me', profileController.deleteMyProfile);

module.exports = router;