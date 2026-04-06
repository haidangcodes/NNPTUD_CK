const pool = require('../utils/db');

const getMyCompany = async (req, res) => {
  try {
    const [congTys] = await pool.execute(
      'SELECT * FROM congty WHERE nguoiDungId = ?',
      [req.user.id]
    );

    if (congTys.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy công ty'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: congTys[0],
      message: 'Lấy thông tin công ty thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const createOrUpdateMyCompany = async (req, res) => {
  try {
    const {
      tenCongTy, tenGiaoDich, loaiHinh, linhVuc, moTa, quyMo, namThanhlap,
      soDienThoai, emailLienHe, diaChi, tinhThanh, quocGia,
      logoUrl, anhBiaUrl, website, maSoThue, soGiayPhepKD, phucLoi
    } = req.body;

    const [existing] = await pool.execute(
      'SELECT id FROM congty WHERE nguoiDungId = ?',
      [req.user.id]
    );

    if (existing.length === 0) {
      // Create new
      const id = require('uuid').v4();
      await pool.execute(`
        INSERT INTO congty (id, nguoiDungId, tenCongTy, tenGiaoDich, loaiHinh, linhVuc, moTa, quyMo, namThanhlap,
          soDienThoai, emailLienHe, diaChi, tinhThanh, quocGia, logoUrl, anhBiaUrl, website, maSoThue, soGiayPhepKD,
          phucLoi, trangThai, ngayTao, ngayCapNhat)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'CHỜ_XỬ_LÝ', NOW(), NOW())
      `, [id, req.user.id, tenCongTy, tenGiaoDich, loaiHinh, linhVuc, moTa, quyMo, namThanhlap,
        soDienThoai, emailLienHe, diaChi, tinhThanh, quocGia || 'Việt Nam', logoUrl, anhBiaUrl, website, maSoThue, soGiayPhepKD, JSON.stringify(phucLoi || [])]);
    } else {
      // Update existing
      const updates = [];
      const values = [];
      if (tenCongTy !== undefined) { updates.push('tenCongTy = ?'); values.push(tenCongTy); }
      if (tenGiaoDich !== undefined) { updates.push('tenGiaoDich = ?'); values.push(tenGiaoDich); }
      if (loaiHinh !== undefined) { updates.push('loaiHinh = ?'); values.push(loaiHinh); }
      if (linhVuc !== undefined) { updates.push('linhVuc = ?'); values.push(linhVuc); }
      if (moTa !== undefined) { updates.push('moTa = ?'); values.push(moTa); }
      if (quyMo !== undefined) { updates.push('quyMo = ?'); values.push(quyMo); }
      if (namThanhlap !== undefined) { updates.push('namThanhlap = ?'); values.push(namThanhlap); }
      if (soDienThoai !== undefined) { updates.push('soDienThoai = ?'); values.push(soDienThoai); }
      if (emailLienHe !== undefined) { updates.push('emailLienHe = ?'); values.push(emailLienHe); }
      if (diaChi !== undefined) { updates.push('diaChi = ?'); values.push(diaChi); }
      if (tinhThanh !== undefined) { updates.push('tinhThanh = ?'); values.push(tinhThanh); }
      if (quocGia !== undefined) { updates.push('quocGia = ?'); values.push(quocGia); }
      if (logoUrl !== undefined) { updates.push('logoUrl = ?'); values.push(logoUrl); }
      if (anhBiaUrl !== undefined) { updates.push('anhBiaUrl = ?'); values.push(anhBiaUrl); }
      if (website !== undefined) { updates.push('website = ?'); values.push(website); }
      if (maSoThue !== undefined) { updates.push('maSoThue = ?'); values.push(maSoThue); }
      if (soGiayPhepKD !== undefined) { updates.push('soGiayPhepKD = ?'); values.push(soGiayPhepKD); }
      if (phucLoi !== undefined) { updates.push('phucLoi = ?'); values.push(JSON.stringify(phucLoi)); }

      if (updates.length > 0) {
        updates.push('ngayCapNhat = NOW()');
        values.push(req.user.id);
        await pool.execute(`UPDATE congty SET ${updates.join(', ')} WHERE nguoiDungId = ?`, values);
      }
    }

    const [congTys] = await pool.execute('SELECT * FROM congty WHERE nguoiDungId = ?', [req.user.id]);

    return res.status(200).json({
      status: 'success',
      data: congTys[0],
      message: 'Lưu thông tin công ty thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const [congTys] = await pool.execute(`
      SELECT ct.*, nd.email as nguoiDungEmail, nd.ho, nd.ten
      FROM congty ct
      LEFT JOIN nguoidung nd ON ct.nguoiDungId = nd.id
      WHERE ct.id = ?
    `, [req.params.id]);

    if (congTys.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy công ty'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: congTys[0],
      message: 'Lấy thông tin công ty thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const { trangThai, tinhThanh, linhVuc, quyMo } = req.query;
    let query = `
      SELECT ct.*, nd.email as nguoiDungEmail, nd.ho, nd.ten
      FROM congty ct
      LEFT JOIN nguoidung nd ON ct.nguoiDungId = nd.id
      WHERE 1=1
    `;
    const params = [];

    if (trangThai) { query += ' AND ct.trangThai = ?'; params.push(trangThai); }
    if (tinhThanh) { query += ' AND ct.tinhThanh = ?'; params.push(tinhThanh); }
    if (linhVuc) { query += ' AND ct.linhVuc = ?'; params.push(linhVuc); }
    if (quyMo) { query += ' AND ct.quyMo = ?'; params.push(quyMo); }

    query += ' ORDER BY ct.ngayTao DESC';

    const [congTys] = await pool.execute(query, params);

    return res.status(200).json({
      status: 'success',
      data: congTys,
      message: 'Lấy danh sách công ty thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const approveCompany = async (req, res) => {
  try {
    const [congTys] = await pool.execute('SELECT * FROM congty WHERE id = ?', [req.params.id]);
    if (congTys.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy công ty'
      });
    }

    await pool.execute(
      'UPDATE congty SET trangThai = "ĐƯỢC_DUYỆT", ngayDuyet = NOW() WHERE id = ?',
      [req.params.id]
    );

    const [updated] = await pool.execute('SELECT * FROM congty WHERE id = ?', [req.params.id]);

    return res.status(200).json({
      status: 'success',
      data: updated[0],
      message: 'Duyệt công ty thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const rejectCompany = async (req, res) => {
  try {
    const { lyDoTuChoi } = req.body;
    const [congTys] = await pool.execute('SELECT * FROM congty WHERE id = ?', [req.params.id]);
    if (congTys.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy công ty'
      });
    }

    await pool.execute(
      'UPDATE congty SET trangThai = "BỊ_TỪ_CHỐI", lyDoTuChoi = ? WHERE id = ?',
      [lyDoTuChoi, req.params.id]
    );

    const [updated] = await pool.execute('SELECT * FROM congty WHERE id = ?', [req.params.id]);

    return res.status(200).json({
      status: 'success',
      data: updated[0],
      message: 'Từ chối công ty thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const lockCompany = async (req, res) => {
  try {
    const [congTys] = await pool.execute('SELECT * FROM congty WHERE id = ?', [req.params.id]);
    if (congTys.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy công ty'
      });
    }

    await pool.execute('UPDATE congty SET trangThai = "BỊ_KHÓA" WHERE id = ?', [req.params.id]);

    const [updated] = await pool.execute('SELECT * FROM congty WHERE id = ?', [req.params.id]);

    return res.status(200).json({
      status: 'success',
      data: updated[0],
      message: 'Khóa công ty thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const [congTys] = await pool.execute('SELECT * FROM congty WHERE id = ?', [req.params.id]);
    if (congTys.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Không tìm thấy công ty'
      });
    }

    const isOwner = congTys[0].nguoiDungId === req.user.id;
    const isAdmin = req.user.vaiTro === 'QUAN_TRI';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        status: 'error',
        message: 'Bạn chỉ có thể xóa công ty của mình'
      });
    }

    await pool.execute('DELETE FROM congty WHERE id = ?', [req.params.id]);

    return res.status(200).json({
      status: 'success',
      data: null,
      message: 'Xóa công ty thành công'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getMyCompany,
  createOrUpdateMyCompany,
  getCompanyById,
  getAllCompanies,
  approveCompany,
  rejectCompany,
  lockCompany,
  deleteCompany
};
