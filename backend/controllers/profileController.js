const pool = require('../utils/db');

const getMyProfile = async (req, res) => {
  try {
    const [hoSos] = await pool.execute(
      `SELECT hs.*, nd.email, nd.ho, nd.ten, nd.avatarUrl
       FROM hoso hs
       LEFT JOIN nguoidung nd ON hs.nguoiDungId = nd.id
       WHERE hs.nguoiDungId = ?`,
      [req.user.id]
    );

    if (hoSos.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy hồ sơ'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: hoSos[0],
      message: 'Lấy thông tin hồ sơ thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const {
      hoVaTen, ngaySinh, gioiTinh, diaChi, tinhThanh, quocGia,
      soDienThoai, gioiThieuBanThan, kyNang, kinhNghiemLamViec,
      hocVan, ngoaiNgu, chungChi, lienKet, cvUrl, loaiCv,
      mongMuon, trangThaiHoSo
    } = req.body;

    const [existing] = await pool.execute(
      'SELECT id FROM hoso WHERE nguoiDungId = ?',
      [req.user.id]
    );

    if (existing.length === 0) {
      // Create new profile
      const id = require('uuid').v4();
      await pool.execute(`
        INSERT INTO hoso (id, nguoiDungId, hoVaTen, ngaySinh, gioiTinh, diaChi, tinhThanh, quocGia,
          soDienThoai, gioiThieuBanThan, kyNang, kinhNghiemLamViec, hocVan, ngoaiNgu, chungChi,
          lienKet, cvUrl, loaiCv, mongMuon, trangThaiHoSo, ngayTao, ngayCapNhat)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CONG_KHAI', NOW(), NOW())
      `, [id, req.user.id, hoVaTen, ngaySinh, gioiTinh, diaChi, tinhThanh, quocGia || 'Việt Nam',
        soDienThoai, gioiThieuBanThan, JSON.stringify(kyNang || []), JSON.stringify(kinhNghiemLamViec || []),
        JSON.stringify(hocVan || []), JSON.stringify(ngoaiNgu || []), JSON.stringify(chungChi || []),
        JSON.stringify(lienKet || {}), cvUrl, loaiCv, JSON.stringify(mongMuon || {})]);
    } else {
      // Update existing
      const updates = [];
      const values = [];
      if (hoVaTen !== undefined) { updates.push('hoVaTen = ?'); values.push(hoVaTen); }
      if (ngaySinh !== undefined) { updates.push('ngaySinh = ?'); values.push(ngaySinh); }
      if (gioiTinh !== undefined) { updates.push('gioiTinh = ?'); values.push(gioiTinh); }
      if (diaChi !== undefined) { updates.push('diaChi = ?'); values.push(diaChi); }
      if (tinhThanh !== undefined) { updates.push('tinhThanh = ?'); values.push(tinhThanh); }
      if (quocGia !== undefined) { updates.push('quocGia = ?'); values.push(quocGia); }
      if (soDienThoai !== undefined) { updates.push('soDienThoai = ?'); values.push(soDienThoai); }
      if (gioiThieuBanThan !== undefined) { updates.push('gioiThieuBanThan = ?'); values.push(gioiThieuBanThan); }
      if (kyNang !== undefined) { updates.push('kyNang = ?'); values.push(JSON.stringify(kyNang)); }
      if (kinhNghiemLamViec !== undefined) { updates.push('kinhNghiemLamViec = ?'); values.push(JSON.stringify(kinhNghiemLamViec)); }
      if (hocVan !== undefined) { updates.push('hocVan = ?'); values.push(JSON.stringify(hocVan)); }
      if (ngoaiNgu !== undefined) { updates.push('ngoaiNgu = ?'); values.push(JSON.stringify(ngoaiNgu)); }
      if (chungChi !== undefined) { updates.push('chungChi = ?'); values.push(JSON.stringify(chungChi)); }
      if (lienKet !== undefined) { updates.push('lienKet = ?'); values.push(JSON.stringify(lienKet)); }
      if (cvUrl !== undefined) { updates.push('cvUrl = ?'); values.push(cvUrl); }
      if (loaiCv !== undefined) { updates.push('loaiCv = ?'); values.push(loaiCv); }
      if (mongMuon !== undefined) { updates.push('mongMuon = ?'); values.push(JSON.stringify(mongMuon)); }
      if (trangThaiHoSo !== undefined) { updates.push('trangThaiHoSo = ?'); values.push(trangThaiHoSo); }

      if (updates.length > 0) {
        updates.push('ngayCapNhat = NOW()');
        values.push(req.user.id);
        await pool.execute(`UPDATE hoso SET ${updates.join(', ')} WHERE nguoiDungId = ?`, values);
      }
    }

    const [hoSos] = await pool.execute(
      'SELECT * FROM hoso WHERE nguoiDungId = ?',
      [req.user.id]
    );

    return res.status(200).json({
      status: 'success',
      data: hoSos[0],
      message: 'Cập nhật hồ sơ thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getProfileByUserId = async (req, res) => {
  try {
    const [hoSos] = await pool.execute(
      `SELECT hs.*, nd.email, nd.ho, nd.ten, nd.avatarUrl
       FROM hoso hs
       LEFT JOIN nguoidung nd ON hs.nguoiDungId = nd.id
       WHERE hs.nguoiDungId = ?`,
      [req.params.userId]
    );

    if (hoSos.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy hồ sơ'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: hoSos[0],
      message: 'Lấy thông tin hồ sơ thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const deleteMyProfile = async (req, res) => {
  try {
    const [hoSos] = await pool.execute(
      'SELECT * FROM hoso WHERE nguoiDungId = ?',
      [req.user.id]
    );

    if (hoSos.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy hồ sơ'
      });
    }

    await pool.execute('DELETE FROM hoso WHERE nguoiDungId = ?', [req.user.id]);

    return res.status(200).json({
      status: 'success',
      data: null,
      message: 'Xóa hồ sơ thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getProfileByUserId,
  deleteMyProfile
};
