const pool = require('../utils/db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/authHandler');

const register = async (req, res) => {
  try {
    const { email, password, ho, ten, soDienThoai, vaiTro } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email và mật khẩu là bắt buộc'
      });
    }

    // Check if email exists
    const [existing] = await pool.execute(
      'SELECT id FROM nguoidung WHERE email = ?',
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Email đã được đăng ký'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const id = require('uuid').v4();

    await pool.execute(
      `INSERT INTO nguoidung (id, email, password, ho, ten, soDienThoai, vaiTro, trangThai, ngayTao, ngayCapNhat)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'HOAT_DONG', NOW(), NOW())`,
      [id, email, hashedPassword, ho || '', ten || '', soDienThoai || '', vaiTro || 'UNG_VIEN']
    );

    const [user] = await pool.execute(
      'SELECT id, email, ho, ten, soDienThoai, vaiTro, trangThai FROM nguoidung WHERE id = ?',
      [id]
    );

    const token = generateToken({ _id: id, vaiTro: user[0].vaiTro });

    return res.status(201).json({
      status: 'success',
      message: 'Đăng ký thành công',
      data: { user: user[0], token }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email và mật khẩu là bắt buộc'
      });
    }

    const [users] = await pool.execute(
      'SELECT * FROM nguoidung WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    const user = users[0];

    if (user.trangThai !== 'HOAT_DONG') {
      return res.status(401).json({
        status: 'error',
        message: 'Tài khoản đã bị khóa'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    const token = generateToken({ _id: user.id, vaiTro: user.vaiTro });

    // Remove password from response
    delete user.password;

    return res.status(200).json({
      status: 'success',
      message: 'Đăng nhập thành công',
      data: { user, token }
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = { register, login };
