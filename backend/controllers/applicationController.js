const pool = require('../utils/db');

const applyToJob = async (req, res) => {
  try {
    const { viecLamId, cvUrl, loaiCv, thuXinViec, hoVaTen, email, soDienThoai } = req.body;

    if (!viecLamId || !cvUrl) {
      return res.status(400).json({
        status: 'error',
        message: 'viecLamId và cvUrl là bắt buộc'
      });
    }

    const [viecLams] = await pool.execute(
      'SELECT id, trangThai FROM vieclam WHERE id = ?',
      [viecLamId]
    );

    if (viecLams.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy việc làm'
      });
    }

    if (viecLams[0].trangThai !== 'ĐANG_TUYỂN') {
      return res.status(400).json({
        status: 'error',
        message: 'Việc làm không còn tuyển dụng'
      });
    }

    const [existing] = await pool.execute(
      'SELECT id FROM ungtuyen WHERE viecLamId = ? AND ungVienId = ?',
      [viecLamId, req.user.id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Bạn đã ứng tuyển công việc này rồi'
      });
    }

    const id = require('uuid').v4();
    await pool.execute(`
      INSERT INTO ungtuyen (id, viecLamId, ungVienId, cvUrl, loaiCv, thuXinViec, hoVaTen, email, soDienThoai, trangThai, ngayNop)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'DA_NOP', NOW())
    `, [id, viecLamId, req.user.id, cvUrl, loaiCv || null, thuXinViec || null, hoVaTen || null, email || null, soDienThoai || null]);

    const [newUngTuyen] = await pool.execute('SELECT * FROM ungtuyen WHERE id = ?', [id]);

    return res.status(201).json({
      status: 'success',
      data: newUngTuyen[0],
      message: 'Nộp đơn ứng tuyển thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const [ungTuyens] = await pool.execute(`
      SELECT ut.*, vl.tieuDe, vl.mucLuong, vl.mucLuongToiDa, vl.diaDiem, vl.tinhThanh, vl.loaiHinh
      FROM ungtuyen ut
      LEFT JOIN vieclam vl ON ut.viecLamId = vl.id
      WHERE ut.ungVienId = ?
      ORDER BY ut.ngayNop DESC
    `, [req.user.id]);

    return res.status(200).json({
      status: 'success',
      data: ungTuyens,
      message: 'Lấy danh sách đơn ứng tuyển thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getApplicationsByJob = async (req, res) => {
  try {
    const [viecLams] = await pool.execute(
      'SELECT id, congTyId FROM vieclam WHERE id = ?',
      [req.params.jobId]
    );

    if (viecLams.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy việc làm'
      });
    }

    const [companies] = await pool.execute(
      'SELECT id FROM congty WHERE nguoiDungId = ?',
      [req.user.id]
    );
    const isAdmin = req.user.vaiTro === 'QUAN_TRI';

    if (!isAdmin && (companies.length === 0 || companies[0].id !== viecLams[0].congTyId)) {
      return res.status(403).json({
        status: 'error',
        message: 'Bạn không có quyền truy cập'
      });
    }

    const [ungTuyens] = await pool.execute(`
      SELECT ut.*, nd.email, nd.ho, nd.ten, nd.soDienThoai
      FROM ungtuyen ut
      LEFT JOIN nguoidung nd ON ut.ungVienId = nd.id
      WHERE ut.viecLamId = ?
      ORDER BY ut.ngayNop DESC
    `, [req.params.jobId]);

    return res.status(200).json({
      status: 'success',
      data: ungTuyens,
      message: 'Lấy danh sách ứng viên thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status: trangThai, lyDoTuChoi, ghiChu, nhanXet, diemDanhGia } = req.body;

    const validStatuses = ['DA_NOP', 'DANG_XEM', 'TRUNG_TUYEN', 'TUYEN_THANG', 'TU_CHOI', 'RUT_HO_SO'];
    if (!validStatuses.includes(trangThai)) {
      return res.status(400).json({
        status: 'error',
        message: 'Trạng thái không hợp lệ'
      });
    }

    const [ungTuyens] = await pool.execute('SELECT * FROM ungtuyen WHERE id = ?', [req.params.id]);
    if (ungTuyens.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy đơn ứng tuyển'
      });
    }

    const [viecLams] = await pool.execute(
      'SELECT id, congTyId FROM vieclam WHERE id = ?',
      [ungTuyens[0].viecLamId]
    );

    const [companies] = await pool.execute(
      'SELECT id FROM congty WHERE nguoiDungId = ?',
      [req.user.id]
    );
    const isAdmin = req.user.vaiTro === 'QUAN_TRI';

    if (!isAdmin && (companies.length === 0 || companies[0].id !== viecLams[0].congTyId)) {
      return res.status(403).json({
        status: 'error',
        message: 'Bạn không có quyền cập nhật'
      });
    }

    const updates = ['trangThai = ?'];
    const values = [trangThai];
    if (lyDoTuChoi !== undefined) { updates.push('lyDoTuChoi = ?'); values.push(lyDoTuChoi); }
    if (ghiChu !== undefined) { updates.push('ghiChu = ?'); values.push(ghiChu); }
    if (nhanXet !== undefined) { updates.push('nhanXet = ?'); values.push(nhanXet); }
    if (diemDanhGia !== undefined) { updates.push('diemDanhGia = ?'); values.push(diemDanhGia); }
    if (['TRUNG_TUYEN', 'TUYEN_THANG', 'TU_CHOI'].includes(trangThai)) {
      updates.push('ngayTraLoi = NOW()');
    }

    values.push(req.params.id);
    await pool.execute(`UPDATE ungtuyen SET ${updates.join(', ')} WHERE id = ?`, values);

    const [updated] = await pool.execute('SELECT * FROM ungtuyen WHERE id = ?', [req.params.id]);

    return res.status(200).json({
      status: 'success',
      data: updated[0],
      message: 'Cập nhật trạng thái đơn ứng tuyển thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const [ungTuyens] = await pool.execute(`
      SELECT ut.*, vl.tieuDe as viecLamTieuDe, vl.moTa as viecLamMoTa,
             nd.email, nd.ho, nd.ten, nd.soDienThoai
      FROM ungtuyen ut
      LEFT JOIN vieclam vl ON ut.viecLamId = vl.id
      LEFT JOIN nguoidung nd ON ut.ungVienId = nd.id
      WHERE ut.id = ?
    `, [req.params.id]);

    if (ungTuyens.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy đơn ứng tuyển'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: ungTuyens[0],
      message: 'Lấy thông tin đơn ứng tuyển thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const [ungTuyens] = await pool.execute('SELECT * FROM ungtuyen WHERE id = ?', [req.params.id]);
    if (ungTuyens.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy đơn ứng tuyển'
      });
    }

    const isOwner = ungTuyens[0].ungVienId === req.user.id;
    const isRecruiter = req.user.vaiTro === 'TUYEN_DUNG';
    const isAdmin = req.user.vaiTro === 'QUAN_TRI';

    if (!isOwner && !isRecruiter && !isAdmin) {
      return res.status(403).json({
        status: 'error',
        message: 'Bạn không có quyền xóa đơn này'
      });
    }

    await pool.execute('DELETE FROM ungtuyen WHERE id = ?', [req.params.id]);

    return res.status(200).json({
      status: 'success',
      data: null,
      message: 'Xóa đơn ứng tuyển thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicationsByJob,
  updateApplicationStatus,
  getApplicationById,
  deleteApplication
};
