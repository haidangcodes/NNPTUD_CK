const express = require('express');
const router = express.Router();
// Đã sửa lại đúng tên file của bạn
const { uploadCV: multerCV, uploadImage: multerImage } = require('../utils/uploadHandler');
const uploadController = require('../controllers/uploadController');

// Route cho CV: Trên Postman Key PHẢI là 'cv'
router.post('/cv', multerCV.single('cv'), uploadController.uploadCV);

// Route cho Image: Trên Postman Key PHẢI là 'image'
router.post('/image', multerImage.single('image'), uploadController.uploadImage);

module.exports = router;