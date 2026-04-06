const pool = require('../utils/db');

const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, danhMuc, trangThai } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const statusFilter = trangThai || 'ĐÃ_XUẤT_BẢN';

    let query = `
      SELECT bv.*, nd.email as tacGiaEmail, nd.ho as tacGiaHo, nd.ten as tacGiaTen
      FROM baiviet bv
      LEFT JOIN nguoidung nd ON bv.tacGiaId = nd.id
      WHERE bv.trangThai = ?
    `;
    const params = [statusFilter];

    if (danhMuc) {
      query += ' AND bv.danhMuc = ?';
      params.push(danhMuc);
    }

    query += ' ORDER BY bv.ngayXuatBan DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), skip);

    const [baiViets] = await pool.query(query, params);

    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM baiviet WHERE trangThai = ?',
      [statusFilter]
    );
    const total = countResult[0].total;

    return res.status(200).json({
      status: 'success',
      data: {
        baiViets,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      },
      message: 'Lấy danh sách bài viết thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getBlogById = async (req, res) => {
  try {
    const [baiViets] = await pool.execute(`
      SELECT bv.*, nd.email as tacGiaEmail, nd.ho as tacGiaHo, nd.ten as tacGiaTen, nd.avatarUrl as tacGiaAvatar
      FROM baiviet bv
      LEFT JOIN nguoidung nd ON bv.tacGiaId = nd.id
      WHERE bv.id = ?
    `, [req.params.id]);

    if (baiViets.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy bài viết'
      });
    }

    // Increase view count
    await pool.execute(
      'UPDATE baiviet SET soLuotXem = soLuotXem + 1 WHERE id = ?',
      [req.params.id]
    );

    const [updated] = await pool.execute('SELECT * FROM baiviet WHERE id = ?', [req.params.id]);

    return res.status(200).json({
      status: 'success',
      data: updated[0],
      message: 'Lấy thông tin bài viết thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const createBlog = async (req, res) => {
  try {
    const {
      tieuDe, noiDung, tomTat, hinhAnhDaiDien, hinhAnhBia, danhSachHinhAnh,
      videoUrl, slug, tuKhoa, theTags, danhMuc, hienThi, baiNoiBat, choPhepBinhLuan
    } = req.body;

    if (!tieuDe || !noiDung) {
      return res.status(400).json({
        status: 'error',
        message: 'Tiêu đề và nội dung là bắt buộc'
      });
    }

    const id = require('uuid').v4();
    await pool.execute(`
      INSERT INTO baiviet (id, tacGiaId, tieuDe, noiDung, tomTat, hinhAnhDaiDien, hinhAnhBia,
        videoUrl, slug, tuKhoa, theTags, danhMuc, hienThi, baiNoiBat,
        choPhepBinhLuan, trangThai, ngayTao, ngayCapNhat)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONG_KHAI', ?, ?, 'NHÁP', NOW(), NOW())
    `, [id, req.user.id, tieuDe, noiDung, tomTat, hinhAnhDaiDien, hinhAnhBia,
      videoUrl, slug, tuKhoa, theTags, danhMuc,
      baiNoiBat || false, choPhepBinhLuan !== false]);

    const [newBlog] = await pool.execute('SELECT * FROM baiviet WHERE id = ?', [id]);

    return res.status(201).json({
      status: 'success',
      data: newBlog[0],
      message: 'Tạo bài viết thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const updateBlog = async (req, res) => {
  try {
    const [baiViets] = await pool.execute('SELECT * FROM baiviet WHERE id = ?', [req.params.id]);
    if (baiViets.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy bài viết'
      });
    }

    if (baiViets[0].tacGiaId !== req.user.id && req.user.vaiTro !== 'QUAN_TRI') {
      return res.status(403).json({
        status: 'error',
        message: 'Bạn không có quyền chỉnh sửa bài viết này'
      });
    }

    const allowedFields = [
      'tieuDe', 'noiDung', 'tomTat', 'hinhAnhDaiDien', 'hinhAnhBia',
      'videoUrl', 'slug', 'tuKhoa', 'theTags', 'danhMuc', 'hienThi', 'baiNoiBat',
      'choPhepBinhLuan', 'trangThai'
    ];

    const updates = [];
    const values = [];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(req.body[field]);
      }
    }

    // If publishing, set the publish date
    if (req.body.trangThai === 'ĐÃ_XUẤT_BẢN' && !baiViets[0].ngayXuatBan) {
      updates.push('ngayXuatBan = NOW()');
    }

    if (updates.length > 0) {
      updates.push('ngayCapNhat = NOW()');
      values.push(req.params.id);
      await pool.execute(`UPDATE baiviet SET ${updates.join(', ')} WHERE id = ?`, values);
    }

    const [updated] = await pool.execute('SELECT * FROM baiviet WHERE id = ?', [req.params.id]);

    return res.status(200).json({
      status: 'success',
      data: updated[0],
      message: 'Cập nhật bài viết thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const [baiViets] = await pool.execute('SELECT * FROM baiviet WHERE id = ?', [req.params.id]);
    if (baiViets.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy bài viết'
      });
    }

    if (baiViets[0].tacGiaId !== req.user.id && req.user.vaiTro !== 'QUAN_TRI') {
      return res.status(403).json({
        status: 'error',
        message: 'Bạn không có quyền xóa bài viết này'
      });
    }

    await pool.execute('DELETE FROM baiviet WHERE id = ?', [req.params.id]);

    return res.status(200).json({
      status: 'success',
      data: null,
      message: 'Xóa bài viết thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getBlogsByAuthor = async (req, res) => {
  try {
    const [baiViets] = await pool.execute(`
      SELECT bv.*, nd.email as tacGiaEmail, nd.ho as tacGiaHo, nd.ten as tacGiaTen, nd.avatarUrl as tacGiaAvatar
      FROM baiviet bv
      LEFT JOIN nguoidung nd ON bv.tacGiaId = nd.id
      WHERE bv.tacGiaId = ?
      ORDER BY bv.ngayTao DESC
    `, [req.params.authorId]);

    return res.status(200).json({
      status: 'success',
      data: baiViets,
      message: 'Lấy danh sách bài viết theo tác giả thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getFeaturedBlogs = async (req, res) => {
  try {
    const [baiViets] = await pool.execute(`
      SELECT bv.*, nd.email as tacGiaEmail, nd.ho as tacGiaHo, nd.ten as tacGiaTen
      FROM baiviet bv
      LEFT JOIN nguoidung nd ON bv.tacGiaId = nd.id
      WHERE bv.trangThai = 'ĐÃ_XUẤT_BẢN' AND bv.baiNoiBat = TRUE
      ORDER BY bv.soLuotXem DESC
      LIMIT 5
    `);

    return res.status(200).json({
      status: 'success',
      data: baiViets,
      message: 'Lấy danh sách bài viết nổi bật thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogsByAuthor,
  getFeaturedBlogs
};
