const pool = require('../utils/db');

const getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, danhMucId, tieuDe, trangThai, congTyId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const status = trangThai || 'ĐANG_TUYỂN';

    let query = `
      SELECT vl.*, ct.tenCongTy, ct.logoUrl, ct.diaChi as diaChiCongTy, ct.moTa as moTaCongTy, ct.website,
             dm.tenDanhMuc
      FROM vieclam vl
      LEFT JOIN congty ct ON vl.congTyId = ct.id
      LEFT JOIN danhmuc dm ON vl.danhMucId = dm.id
      WHERE vl.trangThai = ?
    `;
    const params = [status];

    if (danhMucId) {
      query += ' AND vl.danhMucId = ?';
      params.push(danhMucId);
    }
    if (tieuDe) {
      query += ' AND vl.tieuDe LIKE ?';
      params.push(`%${tieuDe}%`);
    }
    if (congTyId) {
      query += ' AND vl.congTyId = ?';
      params.push(congTyId);
    }

    query += ' ORDER BY vl.ngayTao DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), skip);

    const [viecLams] = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM vieclam WHERE trangThai = ?';
    const countParams = [status];
    if (danhMucId) {
      countQuery += ' AND danhMucId = ?';
      countParams.push(danhMucId);
    }
    if (tieuDe) {
      countQuery += ' AND tieuDe LIKE ?';
      countParams.push(`%${tieuDe}%`);
    }
    if (congTyId) {
      countQuery += ' AND congTyId = ?';
      countParams.push(congTyId);
    }
    const [countResult] = await pool.execute(countQuery, countParams);
    const total = countResult[0].total;

    return res.status(200).json({
      status: 'success',
      data: {
        viecLams,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      },
      message: 'Lấy danh sách việc làm thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getJobById = async (req, res) => {
  try {
    const [viecLam] = await pool.execute(`
      SELECT vl.*, ct.tenCongTy, ct.logoUrl, ct.diaChi as diaChiCongTy, ct.tinhThanh, ct.moTa as moTaCongTy, ct.website,
             dm.tenDanhMuc
      FROM vieclam vl
      LEFT JOIN congty ct ON vl.congTyId = ct.id
      LEFT JOIN danhmuc dm ON vl.danhMucId = dm.id
      WHERE vl.id = ?
    `, [req.params.id]);

    if (viecLam.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy việc làm'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: viecLam[0],
      message: 'Lấy thông tin việc làm thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const createJob = async (req, res) => {
  try {
    const {
      danhMucId, tieuDe, moTa, yeuCau, viTri, soLuong, loaiHinh, capBac,
      mucLuong, mucLuongToiDa, donViTienTe, hinhThucTraLuong,
      diaDiem, tinhThanh, quocGia, lamViecTuXa, thoiGianLamViec,
      kinhNghiemYeucau, trinhDoYeucau, kyNangYeuCau,
      nguoiLienHe, emailLienHe, soDienThoaiLienHe, hanNopHoSo, tags, laTinNoiBat
    } = req.body;

    if (!danhMucId || !tieuDe || !moTa || !yeuCau) {
      return res.status(400).json({
        status: 'error',
        message: 'danhMucId, tieuDe, moTa, và yeuCau là bắt buộc'
      });
    }

    // Get company by user id
    const [companies] = await pool.execute(
      'SELECT id FROM congty WHERE nguoiDungId = ?',
      [req.user.id]
    );
    if (companies.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Không tìm thấy hồ sơ công ty'
      });
    }
    const congTy = companies[0];

    if (congTy.trangThai !== 'ĐƯỢC_DUYỆT') {
      return res.status(403).json({
        status: 'error',
        message: 'Công ty của bạn phải được duyệt để đăng tin tuyển dụng'
      });
    }

    const id = require('uuid').v4();
    await pool.execute(`
      INSERT INTO vieclam (id, congTyId, danhMucId, tieuDe, moTa, yeuCau, viTri, soLuong, loaiHinh, capBac,
        mucLuong, mucLuongToiDa, donViTienTe, hinhThucTraLuong, diaDiem, tinhThanh, quocGia, lamViecTuXa,
        thoiGianLamViec, kinhNghiemYeucau, trinhDoYeucau, kyNangYeuCau,
        nguoiLienHe, emailLienHe, soDienThoaiLienHe, hanNopHoSo, tags, laTinNoiBat, trangThai, ngayBatDauTuyen, ngayTao, ngayCapNhat)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'NHÁP', NOW(), NOW(), NOW())
    `, [id, congTy.id, danhMucId, tieuDe, moTa, yeuCau, viTri, soLuong || 1, loaiHinh || 'TOAN_THỜI_GIAN', capBac || 'NHÂN_VIÊN',
      mucLuong, mucLuongToiDa, donViTienTe || 'VND', hinhThucTraLuong || 'THEO_THÁNG', diaDiem, tinhThanh, quocGia || 'Việt Nam', lamViecTuXa || false,
      thoiGianLamViec, kinhNghiemYeucau || 'KHÔNG_YÊU_CẦU', trinhDoYeucau || 'KHÔNG_YÊU_CẦU', JSON.stringify(kyNangYeuCau || []),
      nguoiLienHe, emailLienHe, soDienThoaiLienHe, hanNopHoSo, JSON.stringify(tags || []), laTinNoiBat || false]);

    const [newJob] = await pool.execute('SELECT * FROM vieclam WHERE id = ?', [id]);

    return res.status(201).json({
      status: 'success',
      data: newJob[0],
      message: 'Tạo tin tuyển dụng thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const updateJob = async (req, res) => {
  try {
    const [jobs] = await pool.execute('SELECT * FROM vieclam WHERE id = ?', [req.params.id]);
    if (jobs.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy việc làm'
      });
    }
    const viecLam = jobs[0];

    const [companies] = await pool.execute(
      'SELECT id FROM congty WHERE nguoiDungId = ?',
      [req.user.id]
    );
    const isAdmin = req.user.vaiTro === 'QUAN_TRI';
    if (!isAdmin && (companies.length === 0 || companies[0].id !== viecLam.congTyId)) {
      return res.status(403).json({
        status: 'error',
        message: 'Bạn chỉ có thể cập nhật tin tuyển dụng của công ty mình'
      });
    }

    const allowedFields = [
      'danhMucId', 'tieuDe', 'moTa', 'yeuCau', 'viTri', 'soLuong', 'loaiHinh', 'capBac',
      'mucLuong', 'mucLuongToiDa', 'donViTienTe', 'hinhThucTraLuong',
      'diaDiem', 'tinhThanh', 'quocGia', 'lamViecTuXa', 'thoiGianLamViec',
      'kinhNghiemYeucau', 'trinhDoYeucau', 'kyNangYeuCau',
      'nguoiLienHe', 'emailLienHe', 'soDienThoaiLienHe', 'hanNopHoSo', 'tags', 'laTinNoiBat', 'trangThai'
    ];

    const updates = [];
    const values = [];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = ?`);
        if (field === 'kyNangYeuCau' || field === 'tags') {
          values.push(JSON.stringify(req.body[field]));
        } else {
          values.push(req.body[field]);
        }
      }
    }

    if (updates.length > 0) {
      updates.push('ngayCapNhat = NOW()');
      values.push(req.params.id);
      await pool.execute(`UPDATE vieclam SET ${updates.join(', ')} WHERE id = ?`, values);
    }

    const [updatedJob] = await pool.execute('SELECT * FROM vieclam WHERE id = ?', [req.params.id]);

    return res.status(200).json({
      status: 'success',
      data: updatedJob[0],
      message: 'Cập nhật tin tuyển dụng thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    const [jobs] = await pool.execute('SELECT * FROM vieclam WHERE id = ?', [req.params.id]);
    if (jobs.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy việc làm'
      });
    }
    const viecLam = jobs[0];

    const [companies] = await pool.execute(
      'SELECT id FROM congty WHERE nguoiDungId = ?',
      [req.user.id]
    );
    const isAdmin = req.user.vaiTro === 'QUAN_TRI';
    if (!isAdmin && (companies.length === 0 || companies[0].id !== viecLam.congTyId)) {
      return res.status(403).json({
        status: 'error',
        message: 'Bạn chỉ có thể xóa tin tuyển dụng của công ty mình'
      });
    }

    await pool.execute('DELETE FROM vieclam WHERE id = ?', [req.params.id]);

    return res.status(200).json({
      status: 'success',
      data: null,
      message: 'Xóa tin tuyển dụng thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getMyJobs = async (req, res) => {
  try {
    const [companies] = await pool.execute(
      'SELECT id FROM congty WHERE nguoiDungId = ?',
      [req.user.id]
    );
    if (companies.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Không tìm thấy hồ sơ công ty'
      });
    }

    const [viecLams] = await pool.execute(`
      SELECT vl.*, dm.tenDanhMuc
      FROM vieclam vl
      LEFT JOIN danhmuc dm ON vl.danhMucId = dm.id
      WHERE vl.congTyId = ?
      ORDER BY vl.ngayTao DESC
    `, [companies[0].id]);

    return res.status(200).json({
      status: 'success',
      data: viecLams,
      message: 'Lấy danh sách việc làm của bạn thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs
};
