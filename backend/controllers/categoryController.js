const pool = require('../utils/db');

const getAllCategories = async (req, res) => {
  try {
    const [danhmucs] = await pool.execute(
      'SELECT * FROM danhmuc WHERE trangThai = "HOAT_DONG" ORDER BY thuTu ASC'
    );

    return res.status(200).json({
      status: 'success',
      data: danhmucs,
      message: 'Lấy danh sách danh mục thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const [danhmucs] = await pool.execute(
      'SELECT * FROM danhmuc WHERE id = ?',
      [req.params.id]
    );

    if (danhmucs.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy danh mục'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: danhmucs[0],
      message: 'Lấy thông tin danh mục thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { tenDanhMuc, moTa, hinhAnh, duongDan, tuKhoa } = req.body;

    if (!tenDanhMuc) {
      return res.status(400).json({
        status: 'error',
        message: 'Tên danh mục là bắt buộc'
      });
    }

    const id = require('uuid').v4();
    await pool.execute(`
      INSERT INTO danhmuc (id, tenDanhMuc, moTa, hinhAnh, duongDan, tuKhoa, trangThai, ngayTao, ngayCapNhat)
      VALUES (?, ?, ?, ?, ?, ?, 'HOAT_DONG', NOW(), NOW())
    `, [id, tenDanhMuc, moTa, hinhAnh, duongDan, tuKhoa]);

    const [newCategory] = await pool.execute('SELECT * FROM danhmuc WHERE id = ?', [id]);

    return res.status(201).json({
      status: 'success',
      data: newCategory[0],
      message: 'Tạo danh mục thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { tenDanhMuc, moTa, hinhAnh, duongDan, tuKhoa, trangThai } = req.body;

    const [danhmucs] = await pool.execute('SELECT * FROM danhmuc WHERE id = ?', [req.params.id]);
    if (danhmucs.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy danh mục'
      });
    }

    const updates = [];
    const values = [];
    if (tenDanhMuc !== undefined) { updates.push('tenDanhMuc = ?'); values.push(tenDanhMuc); }
    if (moTa !== undefined) { updates.push('moTa = ?'); values.push(moTa); }
    if (hinhAnh !== undefined) { updates.push('hinhAnh = ?'); values.push(hinhAnh); }
    if (duongDan !== undefined) { updates.push('duongDan = ?'); values.push(duongDan); }
    if (tuKhoa !== undefined) { updates.push('tuKhoa = ?'); values.push(tuKhoa); }
    if (trangThai !== undefined) { updates.push('trangThai = ?'); values.push(trangThai); }

    if (updates.length > 0) {
      updates.push('ngayCapNhat = NOW()');
      values.push(req.params.id);
      await pool.execute(`UPDATE danhmuc SET ${updates.join(', ')} WHERE id = ?`, values);
    }

    const [updatedCategory] = await pool.execute('SELECT * FROM danhmuc WHERE id = ?', [req.params.id]);

    return res.status(200).json({
      status: 'success',
      data: updatedCategory[0],
      message: 'Cập nhật danh mục thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const [danhmucs] = await pool.execute('SELECT * FROM danhmuc WHERE id = ?', [req.params.id]);
    if (danhmucs.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy danh mục'
      });
    }

    await pool.execute('DELETE FROM danhmuc WHERE id = ?', [req.params.id]);

    return res.status(200).json({
      status: 'success',
      data: null,
      message: 'Xóa danh mục thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
