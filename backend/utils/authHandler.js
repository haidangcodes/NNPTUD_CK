const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      vaiTro: user.vaiTro
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Không có token được cung cấp'
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({
        status: 'error',
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Lỗi server khi xác thực'
    });
  }
};

const checkRole = (...vaiTros) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Yêu cầu xác thực'
      });
    }

    if (!vaiTros.includes(req.user.vaiTro)) {
      return res.status(403).json({
        status: 'error',
        message: 'Từ chối truy cập. Không đủ quyền hạn'
      });
    }

    next();
  };
};

module.exports = {
  generateToken,
  verifyToken,
  checkRole
};