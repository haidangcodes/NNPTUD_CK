const pool = require('../utils/db');

const createInterview = async (req, res) => {
  try {
    const {
      ungTuyenId, ngayPhongVan, thoiGianBatDau, thoiGianKetThuc, thoiLuong,
      diaDiem, diaDiemCuThe, linkHop, loaiPhongVan,
      nguoiPhongVan, emailNguoiPhongVan, soDienThoaiNguoiPhongVan,
      vong, tenVong, nhacNho, soPhutNhacTruoc
    } = req.body;

    if (!ungTuyenId || !ngayPhongVan) {
      return res.status(400).json({
        status: 'error',
        message: 'ungTuyenId và ngayPhongVan là bắt buộc'
      });
    }

    const [ungTuyens] = await pool.execute(
      'SELECT * FROM ungtuyen WHERE id = ?',
      [ungTuyenId]
    );

    if (ungTuyens.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy đơn ứng tuyển'
      });
    }

    if (!['DANG_XEM', 'TRUNG_TUYEN'].includes(ungTuyens[0].trangThai)) {
      return res.status(400).json({
        status: 'error',
        message: 'Đơn ứng tuyển phải đang được xem hoặc trúng tuyển trước khi lên lịch phỏng vấn'
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
        message: 'Bạn không có quyền tạo lịch phỏng vấn'
      });
    }

    const id = require('uuid').v4();
    await pool.execute(`
      INSERT INTO phongvan (id, ungTuyenId, ngayPhongVan, thoiGianBatDau, thoiGianKetThuc, thoiLuong,
        diaDiem, diaDiemCuThe, linkHop, loaiPhongVan, nguoiPhongVan, emailNguoiPhongVan,
        soDienThoaiNguoiPhongVan, vong, tenVong, nhacNho, soPhutNhacTruoc, trangThai, ngayTao, ngayCapNhat)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CHƯA_DIỄN_RA', NOW(), NOW())
    `, [id, ungTuyenId, ngayPhongVan, thoiGianBatDau, thoiGianKetThuc, thoiLuong,
      diaDiem, diaDiemCuThe, linkHop, loaiPhongVan || 'TRUC_TIEP', nguoiPhongVan,
      emailNguoiPhongVan, soDienThoaiNguoiPhongVan, vong || 1, tenVong,
      nhacNho !== false, soPhutNhacTruoc || 30]);

    // Update application interview date
    await pool.execute(
      'UPDATE ungtuyen SET ngayHenPhongVan = ? WHERE id = ?',
      [ngayPhongVan, ungTuyenId]
    );

    const [newPhongVan] = await pool.execute('SELECT * FROM phongvan WHERE id = ?', [id]);

    return res.status(201).json({
      status: 'success',
      data: newPhongVan[0],
      message: 'Tạo lịch phỏng vấn thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getInterviewsByApplication = async (req, res) => {
  try {
    const [phongVans] = await pool.execute(
      'SELECT * FROM phongvan WHERE ungTuyenId = ? ORDER BY ngayPhongVan ASC',
      [req.params.applicationId]
    );

    return res.status(200).json({
      status: 'success',
      data: phongVans,
      message: 'Lấy danh sách phỏng vấn thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getMyInterviews = async (req, res) => {
  try {
    if (req.user.vaiTro === 'UNG_VIEN') {
      const [phongVans] = await pool.execute(`
        SELECT pv.*, ut.viecLamId, ut.ungVienId,
               vl.tieuDe as viecLamTieuDe, ct.tenCongTy
        FROM phongvan pv
        LEFT JOIN ungtuyen ut ON pv.ungTuyenId = ut.id
        LEFT JOIN vieclam vl ON ut.viecLamId = vl.id
        LEFT JOIN congty ct ON vl.congTyId = ct.id
        WHERE ut.ungVienId = ?
        ORDER BY pv.ngayPhongVan ASC
      `, [req.user.id]);

      return res.status(200).json({
        status: 'success',
        data: phongVans,
        message: 'Lấy danh sách phỏng vấn thành công'
      });
    } else {
      const [phongVans] = await pool.execute(`
        SELECT pv.*, ut.viecLamId, ut.ungVienId,
               vl.tieuDe as viecLamTieuDe, ct.tenCongTy, ct.nguoiDungId as congTyNguoiDung
        FROM phongvan pv
        LEFT JOIN ungtuyen ut ON pv.ungTuyenId = ut.id
        LEFT JOIN vieclam vl ON ut.viecLamId = vl.id
        LEFT JOIN congty ct ON vl.congTyId = ct.id
        ORDER BY pv.ngayPhongVan ASC
      `);

      // Filter based on role
      const filteredPhongVans = phongVans.filter(pv => {
        if (req.user.vaiTro === 'QUAN_TRI') return true;
        return pv.congTyNguoiDung === req.user.id;
      });

      return res.status(200).json({
        status: 'success',
        data: filteredPhongVans,
        message: 'Lấy danh sách phỏng vấn thành công'
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const updateInterview = async (req, res) => {
  try {
    const {
      ngayPhongVan, thoiGianBatDau, thoiGianKetThuc, thoiLuong,
      diaDiem, diaDiemCuThe, linkHop, loaiPhongVan,
      nguoiPhongVan, emailNguoiPhongVan, soDienThoaiNguoiPhongVan,
      vong, tenVong, trangThai, ketQua, nhanXet, diemDanhGia
    } = req.body;

    const [phongVans] = await pool.execute('SELECT * FROM phongvan WHERE id = ?', [req.params.id]);
    if (phongVans.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy lịch phỏng vấn'
      });
    }

    const [ungTuyens] = await pool.execute(
      'SELECT viecLamId FROM ungtuyen WHERE id = ?',
      [phongVans[0].ungTuyenId]
    );
    const [viecLams] = await pool.execute(
      'SELECT congTyId FROM vieclam WHERE id = ?',
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

    const updates = [];
    const values = [];
    if (ngayPhongVan !== undefined) { updates.push('ngayPhongVan = ?'); values.push(ngayPhongVan); }
    if (thoiGianBatDau !== undefined) { updates.push('thoiGianBatDau = ?'); values.push(thoiGianBatDau); }
    if (thoiGianKetThuc !== undefined) { updates.push('thoiGianKetThuc = ?'); values.push(thoiGianKetThuc); }
    if (thoiLuong !== undefined) { updates.push('thoiLuong = ?'); values.push(thoiLuong); }
    if (diaDiem !== undefined) { updates.push('diaDiem = ?'); values.push(diaDiem); }
    if (diaDiemCuThe !== undefined) { updates.push('diaDiemCuThe = ?'); values.push(diaDiemCuThe); }
    if (linkHop !== undefined) { updates.push('linkHop = ?'); values.push(linkHop); }
    if (loaiPhongVan !== undefined) { updates.push('loaiPhongVan = ?'); values.push(loaiPhongVan); }
    if (nguoiPhongVan !== undefined) { updates.push('nguoiPhongVan = ?'); values.push(nguoiPhongVan); }
    if (emailNguoiPhongVan !== undefined) { updates.push('emailNguoiPhongVan = ?'); values.push(emailNguoiPhongVan); }
    if (soDienThoaiNguoiPhongVan !== undefined) { updates.push('soDienThoaiNguoiPhongVan = ?'); values.push(soDienThoaiNguoiPhongVan); }
    if (vong !== undefined) { updates.push('vong = ?'); values.push(vong); }
    if (tenVong !== undefined) { updates.push('tenVong = ?'); values.push(tenVong); }
    if (trangThai !== undefined) { updates.push('trangThai = ?'); values.push(trangThai); }
    if (ketQua !== undefined) { updates.push('ketQua = ?'); values.push(ketQua); }
    if (nhanXet !== undefined) { updates.push('nhanXet = ?'); values.push(nhanXet); }
    if (diemDanhGia !== undefined) { updates.push('diemDanhGia = ?'); values.push(diemDanhGia); }

    if (updates.length > 0) {
      updates.push('ngayCapNhat = NOW()');
      values.push(req.params.id);
      await pool.execute(`UPDATE phongvan SET ${updates.join(', ')} WHERE id = ?`, values);
    }

    const [updated] = await pool.execute('SELECT * FROM phongvan WHERE id = ?', [req.params.id]);

    return res.status(200).json({
      status: 'success',
      data: updated[0],
      message: 'Cập nhật lịch phỏng vấn thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const deleteInterview = async (req, res) => {
  try {
    const [phongVans] = await pool.execute('SELECT * FROM phongvan WHERE id = ?', [req.params.id]);
    if (phongVans.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy lịch phỏng vấn'
      });
    }

    const [ungTuyens] = await pool.execute(
      'SELECT viecLamId FROM ungtuyen WHERE id = ?',
      [phongVans[0].ungTuyenId]
    );
    const [viecLams] = await pool.execute(
      'SELECT congTyId FROM vieclam WHERE id = ?',
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
        message: 'Bạn không có quyền xóa'
      });
    }

    await pool.execute('DELETE FROM phongvan WHERE id = ?', [req.params.id]);

    return res.status(200).json({
      status: 'success',
      data: null,
      message: 'Xóa lịch phỏng vấn thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const addInterviewNote = async (req, res) => {
  try {
    const { noiDung } = req.body;
    const [phongVans] = await pool.execute('SELECT * FROM phongvan WHERE id = ?', [req.params.id]);
    if (phongVans.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy lịch phỏng vấn'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: phongVans[0],
      message: 'Thêm ghi chú thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  createInterview,
  getInterviewsByApplication,
  getMyInterviews,
  updateInterview,
  deleteInterview,
  addInterviewNote
};
