const path = require('path');

/**
 * Controller xử lý Upload chung cho cả CV và Image
 * Giúp tránh lỗi "Unexpected field" bằng cách kiểm tra req.file
 */
const uploadCV = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Không có file nào được tải lên. Hãy kiểm tra lại Key trong Postman!'
      });
    }

    // Tự động nhận diện folder dựa trên cấu hình multer của bạn
    // Nếu bạn upload vào folder cvs thì dùng link cvs, nếu images thì dùng images
    const folder = req.file.fieldname === 'cv' ? 'cvs' : 'images';
    const fileUrl = `/uploads/${folder}/${req.file.filename}`;

    return res.status(200).json({
      status: 'success',
      data: {
        url: fileUrl,
        fileName: req.file.filename,
        size: `${(req.file.size / 1024).toFixed(2)} KB`,
        mimetype: req.file.mimetype
      },
      message: 'Tải lên thành công!'
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi Server: ' + error.message
    });
  }
};

// Bạn có thể dùng chung 1 hàm xử lý hoặc tách ra như cũ
const uploadImage = uploadCV;

module.exports = {
  uploadCV,
  uploadImage
};