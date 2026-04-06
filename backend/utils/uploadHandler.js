const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = {
  cvs: path.join(__dirname, '../uploads/cvs'),
  images: path.join(__dirname, '../uploads/images')
};

Object.values(uploadDir).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storageCVs = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir.cvs);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `cv-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const storageImages = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir.images);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `img-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilterCV = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed for CV'), false);
  }
};

const fileFilterImage = (req, file, cb) => {
  if (['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG and PNG files are allowed'), false);
  }
};

const uploadCV = multer({
  storage: storageCVs,
  fileFilter: fileFilterCV,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

const uploadImage = multer({
  storage: storageImages,
  fileFilter: fileFilterImage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

module.exports = {
  uploadCV,
  uploadImage
};
