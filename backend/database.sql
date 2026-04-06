-- =============================================
-- CỔNG THÔNG TIN TUYỂN DỤNG - DỮ LIỆU MẪU
-- MySQL Database: jobportal
-- =============================================

-- Mật khẩu cho tất cả users: password123
-- Hash: $2a$12$UNXRlhyk7RbIMOw4vugt6eio6wGeHYTEQnQ1vEwtieF.TddwtK6w.

-- =============================================
-- XÓA DATABASE VÀ TẠO LẠI
-- =============================================
DROP DATABASE IF EXISTS jobportal;
CREATE DATABASE jobportal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jobportal;

-- =============================================
-- NGƯỜI DÙNG (NguoiDung)
-- =============================================
DROP TABLE IF EXISTS nguoidung;
CREATE TABLE nguoidung (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    ho VARCHAR(50),
    ten VARCHAR(50),
    soDienThoai VARCHAR(20),
    avatarUrl VARCHAR(500),
    vaiTro ENUM('QUAN_TRI', 'TUYEN_DUNG', 'UNG_VIEN') DEFAULT 'UNG_VIEN',
    trangThai ENUM('HOAT_DONG', 'KHONG_HOAT_DONG', 'CHO_XAC_THUC') DEFAULT 'HOAT_DONG',
    ngayXacThuc DATETIME,
    soLanDangNhapSai INT DEFAULT 0,
    lanDangNhapCuoi DATETIME,
    refreshToken TEXT,
    ngayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngayCapNhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_vaiTro (vaiTro),
    INDEX idx_trangThai (trangThai)
);

INSERT INTO nguoidung (id, email, password, ho, ten, soDienThoai, avatarUrl, vaiTro, trangThai, ngayXacThuc, soLanDangNhapSai, lanDangNhapCuoi, ngayTao, ngayCapNhat) VALUES
('507f1f77bcf86cd799439011', 'admin@jobportal.vn', '$2a$12$UNXRlhyk7RbIMOw4vugt6eio6wGeHYTEQnQ1vEwtieF.TddwtK6w.', 'Nguyễn', 'Văn Minh', '0901234567', NULL, 'QUAN_TRI', 'HOAT_DONG', '2024-01-01 00:00:00', 0, '2026-04-06 10:30:00', '2024-01-01 00:00:00', '2026-04-06 10:30:00'),
('507f1f77bcf86cd799439012', 'tuyendung@techcorp.com', '$2a$12$UNXRlhyk7RbIMOw4vugt6eio6wGeHYTEQnQ1vEwtieF.TddwtK6w.', 'Trần', 'Thị Hương', '0912345678', 'https://example.com/avatars/tranthihuong.jpg', 'TUYEN_DUNG', 'HOAT_DONG', '2024-01-15 00:00:00', 0, '2026-04-06 08:15:00', '2024-01-15 00:00:00', '2026-04-06 08:15:00'),
('507f1f77bcf86cd799439013', 'tuyendung@startupvn.vn', '$2a$12$UNXRlhyk7RbIMOw4vugt6eio6wGeHYTEQnQ1vEwtieF.TddwtK6w.', 'Lê', 'Hoàng Nam', '0923456789', 'https://example.com/avatars/lehongnam.jpg', 'TUYEN_DUNG', 'HOAT_DONG', '2024-02-01 00:00:00', 0, '2026-04-05 14:20:00', '2024-02-01 00:00:00', '2026-04-05 14:20:00'),
('507f1f77bcf86cd799439014', 'nguyenvancuong@email.com', '$2a$12$UNXRlhyk7RbIMOw4vugt6eio6wGeHYTEQnQ1vEwtieF.TddwtK6w.', 'Nguyễn', 'Văn Cường', '0934567890', 'https://example.com/avatars/nguyencuong.jpg', 'UNG_VIEN', 'HOAT_DONG', '2024-03-01 00:00:00', 0, '2026-04-06 09:00:00', '2024-03-01 00:00:00', '2026-04-06 09:00:00'),
('507f1f77bcf86cd799439015', 'phamthithuy@email.com', '$2a$12$UNXRlhyk7RbIMOw4vugt6eio6wGeHYTEQnQ1vEwtieF.TddwtK6w.', 'Phạm', 'Thị Thúy', '0945678901', 'https://example.com/avatars/phamthuy.jpg', 'UNG_VIEN', 'HOAT_DONG', '2024-03-15 00:00:00', 0, '2026-04-05 16:45:00', '2024-03-15 00:00:00', '2026-04-05 16:45:00'),
('507f1f77bcf86cd799439016', 'hoangvanhieu@email.com', '$2a$12$UNXRlhyk7RbIMOw4vugt6eio6wGeHYTEQnQ1vEwtieF.TddwtK6w.', 'Hoàng', 'Văn Hiếu', '0956789012', 'https://example.com/avatars/hoanghieu.jpg', 'UNG_VIEN', 'HOAT_DONG', '2024-03-20 00:00:00', 0, '2026-04-06 10:00:00', '2024-03-20 00:00:00', '2026-04-06 10:00:00');

-- =============================================
-- DANH MỤC (DanhMuc)
-- =============================================
DROP TABLE IF EXISTS danhmuc;
CREATE TABLE danhmuc (
    id VARCHAR(36) PRIMARY KEY,
    tenDanhMuc VARCHAR(100) UNIQUE NOT NULL,
    moTa TEXT,
    hinhAnh VARCHAR(500),
    danhMucChaId VARCHAR(36),
    duongDan VARCHAR(200),
    tuKhoa VARCHAR(200),
    trangThai ENUM('HOAT_DONG', 'KHONG_HOAT_DONG') DEFAULT 'HOAT_DONG',
    thuTu INT DEFAULT 0,
    soLuongTin INT DEFAULT 0,
    ngayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngayCapNhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tenDanhMuc (tenDanhMuc),
    INDEX idx_trangThai (trangThai)
);

INSERT INTO danhmuc (id, tenDanhMuc, moTa, hinhAnh, danhMucChaId, duongDan, tuKhoa, trangThai, thuTu, soLuongTin) VALUES
('707f1f77bcf86cd799439001', 'Phát triển phần mềm', 'Các vị trí liên quan đến lập trình, phát triển ứng dụng, web, mobile và hệ thống', NULL, NULL, 'phat-trien-phan-mem', 'lập trình, developer, coding, software engineer', 'HOAT_DONG', 1, 0),
('707f1f77bcf86cd799439002', 'Marketing', 'Các vị trí về marketing, quảng cáo, truyền thông và xây dựng thương hiệu', NULL, NULL, 'marketing', 'marketing, digital marketing, quảng cáo, branding', 'HOAT_DONG', 2, 0),
('707f1f77bcf86cd799439003', 'Khoa học dữ liệu', 'Các vị trí về phân tích dữ liệu, machine learning, AI và big data', NULL, NULL, 'khoa-hoc-du-lieu', 'data science, machine learning, AI, analytics, big data', 'HOAT_DONG', 3, 0),
('707f1f77bcf86cd799439004', 'DevOps', 'Các vị trí về hạ tầng, điện toán đám mây, CI/CD và quản trị hệ thống', NULL, NULL, 'devops', 'devops, cloud, CI/CD, sysadmin, infrastructure', 'HOAT_DONG', 4, 0),
('707f1f77bcf86cd799439005', 'Thiết kế', 'Các vị trí về UI/UX design, đồ họa, nghệ thuật và sáng tạo nội dung', NULL, NULL, 'thiet-ke', 'design, UI/UX, graphic design, creative', 'HOAT_DONG', 5, 0),
('707f1f77bcf86cd799439006', 'Tài chính - Kế toán', 'Các vị trí về tài chính, kế toán, ngân hàng và bảo hiểm', NULL, NULL, 'tai-chinh-ke-toan', 'finance, accounting, banking, insurance', 'HOAT_DONG', 6, 0),
('707f1f77bcf86cd799439007', 'Nhân sự', 'Các vị trí về tuyển dụng, đào tạo, phát triển và quản lý nhân sự', NULL, NULL, 'nhan-su', 'hr, recruitment, training, human resources', 'HOAT_DONG', 7, 0),
('707f1f77bcf86cd799439008', 'Chăm sóc khách hàng', 'Các vị trí về hỗ trợ khách hàng, dịch vụ sau bán hàng và quan hệ đối tác', NULL, NULL, 'cham-soc-khach-hang', 'customer service, support, client relations', 'HOAT_DONG', 8, 0);

-- =============================================
-- CÔNG TY (CongTy)
-- =============================================
DROP TABLE IF EXISTS congty;
CREATE TABLE congty (
    id VARCHAR(36) PRIMARY KEY,
    nguoiDungId VARCHAR(36) UNIQUE,
    tenCongTy VARCHAR(200) NOT NULL,
    tenGiaoDich VARCHAR(100),
    loaiHinh ENUM('DOANH_NGHIEP_NHAN_CHINH', 'DOANH_NGHIEP_NHAN_KHOAN', 'CONG_TY_TNHH', 'CONG_TY_CP', 'CONG_TY_TNHH_2TV', 'DOI_TAC', 'KHACH_HANG', 'KHAC') DEFAULT 'KHAC',
    linhVuc VARCHAR(100),
    moTa TEXT,
    quyMo ENUM('1_10', '11_50', '51_100', '101_500', '501_1000', '1000_5000', '5000_10000', '10000+') DEFAULT '1_10',
    namThanhlap INT,
    soDienThoai VARCHAR(20),
    emailLienHe VARCHAR(255),
    diaChi VARCHAR(300),
    tinhThanh VARCHAR(100),
    quocGia VARCHAR(100) DEFAULT 'Việt Nam',
    logoUrl VARCHAR(500),
    anhBiaUrl VARCHAR(500),
    website VARCHAR(200),
    maSoThue VARCHAR(20),
    soGiayPhepKD VARCHAR(50),
    trangThai ENUM('CHỜ_XỬ_LÝ', 'ĐƯỢC_DUYỆT', 'BỊ_TỪ_CHỐI', 'BỊ_KHÓA') DEFAULT 'CHỜ_XỬ_LÝ',
    ngayDuyet DATETIME,
    soLuongTheoDoi INT DEFAULT 0,
    soTinTuyenDung INT DEFAULT 0,
    soUngVienDaTuyen INT DEFAULT 0,
    diemDanhGia DECIMAL(2,1) DEFAULT 0,
    soDanhGia INT DEFAULT 0,
    ngayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngayCapNhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nguoiDungId (nguoiDungId),
    INDEX idx_tenCongTy (tenCongTy),
    INDEX idx_trangThai (trangThai),
    INDEX idx_tinhThanh (tinhThanh)
);

INSERT INTO congty (id, nguoiDungId, tenCongTy, tenGiaoDich, loaiHinh, linhVuc, moTa, quyMo, namThanhlap, soDienThoai, emailLienHe, diaChi, tinhThanh, quocGia, logoUrl, website, trangThai, ngayDuyet, soLuongTheoDoi, soTinTuyenDung, soUngVienDaTuyen, diemDanhGia, soDanhGia) VALUES
('807f1f77bcf86cd799439001', '507f1f77bcf86cd799439012', 'TechCorp Việt Nam', 'TechCorp VN', 'CONG_TY_CP', 'Công nghệ thông tin', 'TechCorp Việt Nam là công ty công nghệ hàng đầu chuyên cung cấp các giải pháp phần mềm doanh nghiệp. Chúng tôi xây dựng các hệ thống ERP, CRM và nền tảng thương mại điện tử cho các doanh nghiệp lớn tại Việt Nam và khu vực Đông Nam Á. Với đội ngũ hơn 200 kỹ sư giàu kinh nghiệm, TechCorp cam kết mang đến những sản phẩm chất lượng cao và dịch vụ xuất sắc.', '101_500', 2010, '02812345678', 'contact@techcorp.vn', 'Lầu 20, Tòa nhà Bitexco, 2 Hải Triều, Quận 1, TP.HCM', 'TP.HCM', 'Việt Nam', 'https://logo.clearbit.com/techcorp.vn', 'https://techcorp.vn', 'ĐƯỢC_DUYỆT', '2024-01-20 00:00:00', 1250, 25, 156, 4.5, 89),
('807f1f77bcf86cd799439002', '507f1f77bcf86cd799439013', 'StartupVN', 'StartupVN JSC', 'CONG_TY_TNHH', 'Công nghệ', 'StartupVN là công ty khởi nghiệp công nghệ đang phát triển nhanh chóng, tập trung vào sản phẩm AI và machine learning. Chúng tôi xây dựng các ứng dụng thông minh giúp doanh nghiệp tối ưu hóa quy trình và ra quyết định dựa trên dữ liệu. Được đầu tư bởi các quỹ venture capital hàng đầu, StartupVN đang mở rộng thị trường ra toàn cầu.', '11_50', 2020, '02823456789', 'hello@startupvn.vn', 'Tầng 10, Tòa nhà Landmark 72, Nam Từ Liêm, Hà Nội', 'Hà Nội', 'Việt Nam', 'https://logo.clearbit.com/startupvn.vn', 'https://startupvn.vn', 'ĐƯỢC_DUYỆT', '2024-02-01 00:00:00', 890, 12, 45, 4.2, 34),
('807f1f77bcf86cd799439003', NULL, 'GameStudio', 'GameStudio Ltd', 'CONG_TY_TNHH', 'Phát triển game', 'GameStudio là công ty phát triển game hàng đầu Việt Nam, chuyên tạo ra các trò chơi mobile và PC hấp dẫn. Với đội ngũ artist và developer tài năng, chúng tôi đã phát hành nhiều tựa game đạt hàng triệu lượt tải. GameStudio không ngừng sáng tạo để mang đến những trải nghiệm giải trí đỉnh cao cho người chơi.', '11_50', 2018, '02834567890', 'careers@gamestudio.vn', 'Tầng 15, Viettel Tower, 285 Cái Khế, Quận 10, TP.HCM', 'TP.HCM', 'Việt Nam', 'https://logo.clearbit.com/gamestudio.vn', 'https://gamestudio.vn', 'ĐƯỢC_DUYỆT', '2024-03-01 00:00:00', 567, 8, 23, 4.0, 21),
('807f1f77bcf86cd799439004', NULL, 'EduLearn', 'EduLearn Inc', 'DOANH_NGHIEP_NHAN_CHINH', 'Giáo dục', 'EduLearn là nền tảng học trực tuyến kết nối học viên với các giáo viên và chuyên gia hàng đầu. Chúng tôi cung cấp các khóa học chất lượng cao về lập trình, ngôn ngữ, kỹ năng mềm và nhiều lĩnh vực khác. Sứ mệnh của EduLearn là làm cho giáo dục trở nên dễ tiếp cận với mọi người.', '1_10', 2022, '02845678901', 'support@edulearn.vn', '123 Đường ABC, Quận 3, TP.HCM', 'TP.HCM', 'Việt Nam', 'https://logo.clearbit.com/edulearn.vn', 'https://edulearn.vn', 'CHỜ_XỬ_LÝ', NULL, 234, 5, 12, 0, 0),
('807f1f77bcf86cd799439005', NULL, 'GreenFarm', 'GreenFarm Co', 'DOANH_NGHIEP_NHAN_KHOAN', 'Nông nghiệp', 'GreenFarm đang cách mạng hóa nông nghiệp bằng công nghệ thông minh. Chúng tôi kết hợp IoT, AI và drone để tối ưu hóa canh tác, tăng năng suất và giảm thiểu tác động môi trường. GreenFarm hướng đến nền nông nghiệp bền vững và hiện đại cho Việt Nam.', '51_100', 2015, '02856789012', 'contact@greenfarm.vn', '456 Đường XYZ, Quận 7, TP.HCM', 'TP.HCM', 'Việt Nam', 'https://logo.clearbit.com/greenfarm.vn', 'https://greenfarm.vn', 'ĐƯỢC_DUYỆT', '2024-03-15 00:00:00', 789, 15, 67, 4.3, 45);

-- =============================================
-- VIỆC LÀM (ViecLam)
-- =============================================
DROP TABLE IF EXISTS vieclam;
CREATE TABLE vieclam (
    id VARCHAR(36) PRIMARY KEY,
    congTyId VARCHAR(36) NOT NULL,
    danhMucId VARCHAR(36) NOT NULL,
    tieuDe VARCHAR(200) NOT NULL,
    moTa TEXT NOT NULL,
    yeuCau TEXT NOT NULL,
    viTri VARCHAR(100),
    soLuong INT DEFAULT 1,
    loaiHinh ENUM('TOAN_THỜI_GIAN', 'BAN_THỜI_GIAN', 'TUYỂN_DỤNG', 'THỰC_TẬP', 'DỰ_ÁN', 'THEO_HOP_DỒNG') DEFAULT 'TOAN_THỜI_GIAN',
    capBac ENUM('MỚI_TỐT_NGHIỆP', 'NHÂN_VIÊN', 'TRƯỞNG_NHÓM', 'QUẢN_LÝ', 'GIÁM_ĐỐC', 'KHÁC') DEFAULT 'NHÂN_VIÊN',
    mucLuong DECIMAL(15,0),
    mucLuongToiDa DECIMAL(15,0),
    donViTienTe VARCHAR(10) DEFAULT 'VND',
    hinhThucTraLuong ENUM('THEO_THÁNG', 'THEO_NGÀY', 'THEO_GIỜ', 'THƯỞNG', 'KHÁC') DEFAULT 'THEO_THÁNG',
    diaDiem VARCHAR(300),
    tinhThanh VARCHAR(100),
    quocGia VARCHAR(100) DEFAULT 'Việt Nam',
    lamViecTuXa BOOLEAN DEFAULT FALSE,
    kinhNghiemYeucau ENUM('KHÔNG_YÊU_CẦU', 'DƯỚI_1_NĂM', '1_2_NĂM', '2_5_NĂM', '5_10_NĂM', 'TRÊN_10_NĂM') DEFAULT 'KHÔNG_YÊU_CẦU',
    trinhDoYeucau ENUM('PHO_THONG', 'TRUNG_CAP', 'CAO_DANG', 'DAI_HOC', 'THAC_SY', 'TIEN_SI', 'KHÔNG_YÊU_CẦU') DEFAULT 'KHÔNG_YÊU_CẦU',
    hanNopHoSo DATETIME,
    ngayBatDauTuyen DATETIME DEFAULT CURRENT_TIMESTAMP,
    trangThai ENUM('NHÁP', 'ĐANG_TUYỂN', 'TẠM_DỪNG', 'ĐÃ_ĐÓNG') DEFAULT 'ĐANG_TUYỂN',
    soLuongUngTuyen INT DEFAULT 0,
    soLuongXem INT DEFAULT 0,
    laTinNoiBat BOOLEAN DEFAULT FALSE,
    ngayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngayCapNhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_congTyId (congTyId),
    INDEX idx_danhMucId (danhMucId),
    INDEX idx_trangThai (trangThai),
    INDEX idx_tieuDe (tieuDe),
    INDEX idx_tinhThanh (tinhThanh)
);

INSERT INTO vieclam (id, congTyId, danhMucId, tieuDe, moTa, yeuCau, viTri, soLuong, loaiHinh, capBac, mucLuong, mucLuongToiDa, diaDiem, tinhThanh, quocGia, lamViecTuXa, kinhNghiemYeucau, trinhDoYeucau, trangThai, soLuongUngTuyen, soLuongXem, laTinNoiBat, ngayTao) VALUES
('907f1f77bcf86cd799439001', '807f1f77bcf86cd799439001', '707f1f77bcf86cd799439001', 'Senior React Developer', 'Chúng tôi đang tìm kiếm một Senior React Developer có kinh nghiệm để tham gia vào đội ngũ phát triển frontend của chúng tôi. Bạn sẽ làm việc trên các dự án lớn, xây dựng giao diện người dùng hiện đại và responsive cho các ứng dụng doanh nghiệp. Cơ hội làm việc với công nghệ mới nhất và phát triển sự nghiệp trong môi trường chuyên nghiệp.', 'Yêu cầu: 4+ năm kinh nghiệm với React và TypeScript. Thành thạo Redux, React Query hoặc Zustand. Có kinh nghiệm với testing (Jest, React Testing Library). Kỹ năng giải quyết vấn đề tốt. Điểm cộng: kinh nghiệm với Next.js, GraphQL.', 'Senior Developer', 2, 'TOAN_THỜI_GIAN', 'NHÂN_VIÊN', 20000000, 35000000, 'Quận 1, TP.HCM', 'TP.HCM', 'Việt Nam', FALSE, '2_5_NĂM', 'DAI_HOC', 'ĐANG_TUYỂN', 15, 234, TRUE, '2026-04-01 00:00:00'),
('907f1f77bcf86cd799439002', '807f1f77bcf86cd799439001', '707f1f77bcf86cd799439001', 'Backend Node.js Developer', 'Tham gia đội ngũ backend của TechCorp để xây dựng các API và microservices quy mô lớn. Bạn sẽ thiết kế và phát triển các tính năng phức tạp, tối ưu hóa hiệu suất hệ thống và đảm bảo chất lượng code. Làm việc chặt chẽ với team frontend và product managers.', 'Yêu cầu: 3+ năm kinh nghiệm với Node.js và Express hoặc NestJS. Thành thạo PostgreSQL hoặc MongoDB. Có kinh nghiệm với Redis, RabbitMQ. Hiểu biết về Docker, Kubernetes là điểm cộng. Kỹ năng teamwork và giao tiếp tốt.', 'Mid-Level Developer', 3, 'TOAN_THỜI_GIAN', 'NHÂN_VIÊN', 15000000, 25000000, 'Quận 1, TP.HCM', 'TP.HCM', 'Việt Nam', FALSE, '1_2_NĂM', 'CAO_DANG', 'ĐANG_TUYỂN', 8, 156, FALSE, '2026-04-02 00:00:00'),
('907f1f77bcf86cd799439003', '807f1f77bcf86cd799439002', '707f1f77bcf86cd799439003', 'Kỹ sư Machine Learning', 'StartupVN đang tìm kiếm ML Engineer để tham gia đội ngũ AI. Bạn sẽ xây dựng và triển khai các mô hình machine learning cho sản phẩm recommendation, NLP và computer vision. Cơ hội làm việc với dữ liệu lớn và áp dụng các kỹ thuật ML tiên tiến nhất.', 'Yêu cầu: Thạo Python, TensorFlow hoặc PyTorch. Có kinh nghiệm triển khai ML models vào production. Hiểu biết về MLOps, model monitoring. Bằng cử nhân hoặc thạc sĩ về CS, Statistics hoặc tương đương. Kinh nghiệm với GCP hoặc AWS là điểm cộng.', 'ML Engineer', 2, 'TOAN_THỜI_GIAN', 'TRƯỞNG_NHÓM', 30000000, 50000000, 'Nam Từ Liêm, Hà Nội', 'Hà Nội', 'Việt Nam', FALSE, '2_5_NĂM', 'THAC_SY', 'ĐANG_TUYỂN', 12, 189, TRUE, '2026-04-03 00:00:00'),
('907f1f77bcf86cd799439004', '807f1f77bcf86cd799439002', '707f1f77bcf86cd799439003', 'Data Engineer', 'Xây dựng và duy trì data pipelines cho hệ thống AI của StartupVN. Thiết kế data warehouse, phát triển ETL processes và đảm bảo chất lượng dữ liệu. Làm việc với các công nghệ big data và cloud infrastructure.', 'Yêu cầu: 3+ năm kinh nghiệm với Python và SQL. Thành thạo Apache Spark, Airflow. Có kinh nghiệm với Snowflake hoặc BigQuery. Hiểu biết về data modeling và ETL/ELT. Kỹ năng troubleshooting tốt.', 'Data Engineer', 2, 'TOAN_THỜI_GIAN', 'NHÂN_VIÊN', 20000000, 30000000, 'Nam Từ Liêm, Hà Nội', 'Hà Nội', 'Việt Nam', FALSE, '2_5_NĂM', 'DAI_HOC', 'ĐANG_TUYỂN', 6, 98, FALSE, '2026-04-04 00:00:00'),
('907f1f77bcf86cd799439005', '807f1f77bcf86cd799439001', '707f1f77bcf86cd799439001', 'Full-stack Developer', 'Tham gia dự án xây dựng nền tảng học trực tuyến của TechCorp. Phát triển cả frontend và backend, tạo ra trải nghiệm học tập tốt nhất cho học viên. Làm việc trong môi trường agile với continuous integration.', 'Yêu cầu: 2+ năm kinh nghiệm với React và Node.js. Thành thạo RESTful API design. Có kinh nghiệm với PostgreSQL, MongoDB. Hiểu biết về Docker basics. Đam mê học tập và phát triển bản thân.', 'Full-stack Developer', 2, 'TOAN_THỜI_GIAN', 'NHÂN_VIÊN', 18000000, 28000000, 'Quận 1, TP.HCM', 'TP.HCM', 'Việt Nam', FALSE, '1_2_NĂM', 'DAI_HOC', 'ĐANG_TUYỂN', 20, 312, TRUE, '2026-04-05 00:00:00'),
('907f1f77bcf86cd799439006', '807f1f77bcf86cd799439003', '707f1f77bcf86cd799439005', 'UI/UX Designer', 'Thiết kế trải nghiệm người dùng hấp dẫn cho các sản phẩm game của GameStudio. Nghiên cứu người dùng, tạo wireframes, prototypes và final designs. Cộng tác chặt chẽ với đội ngũ development để đảm bảo thiết kế được implement chính xác.', 'Yêu cầu: 2+ năm kinh nghiệm với UI/UX design. Thành thạo Figma, Adobe XD. Có portfolio thể hiện design skills. Hiểu biết về gamification và user psychology là điểm cộng. Kỹ năng giao tiếp và thuyết trình tốt.', 'Designer', 1, 'TOAN_THỜI_GIAN', 'NHÂN_VIÊN', 12000000, 20000000, 'Quận 10, TP.HCM', 'TP.HCM', 'Việt Nam', FALSE, '1_2_NĂM', 'CAO_DANG', 'ĐANG_TUYỂN', 5, 87, FALSE, '2026-04-05 00:00:00'),
('907f1f77bcf86cd799439007', '807f1f77bcf86cd799439004', '707f1f77bcf86cd799439004', 'DevOps Engineer', 'Quản lý và cải thiện cloud infrastructure cho EduLearn. Xây dựng CI/CD pipelines, monitoring systems và automation tools. Đảm bảo high availability và security cho nền tảng học trực tuyến phục vụ hàng triệu học viên.', 'Yêu cầu: 3+ năm kinh nghiệm với AWS hoặc GCP. Thành thạo Docker, Kubernetes. Có kinh nghiệm với Terraform, Ansible. Hiểu biết về networking và security. Chứng chỉ AWS hoặc GCP là điểm cộng.', 'DevOps Engineer', 1, 'TOAN_THỜI_GIAN', 'NHÂN_VIÊN', 22000000, 35000000, 'Quận 3, TP.HCM', 'TP.HCM', 'Việt Nam', FALSE, '2_5_NĂM', 'DAI_HOC', 'ĐANG_TUYỂN', 3, 45, FALSE, '2026-04-05 00:00:00'),
('907f1f77bcf86cd799439008', '807f1f77bcf86cd799439005', '707f1f77bcf86cd799439007', 'Marketing Manager', 'Lãnh đạo đội ngũ marketing của GreenFarm và định hướng chiến lược thương hiệu. Phát triển các chiến dịch marketing hiệu quả, quản lý ngân sách và đo lường kết quả. Kết hợp marketing truyền thống và digital marketing để tăng nhận diện thương hiệu.', 'Yêu cầu: 5+ năm kinh nghiệm trong marketing. Có kinh nghiệm quản lý team. Thành thạo các công cụ marketing automation. Kỹ năng phân tích data và strategic thinking. Đam mê về nông nghiệp bền vững là điểm cộng.', 'Marketing Manager', 1, 'TOAN_THỜI_GIAN', 'QUẢN_LÝ', 25000000, 40000000, 'Quận 7, TP.HCM', 'TP.HCM', 'Việt Nam', FALSE, '5_10_NĂM', 'DAI_HOC', 'ĐANG_TUYỂN', 9, 123, FALSE, '2026-04-05 00:00:00'),
('907f1f77bcf86cd799439009', '807f1f77bcf86cd799439003', '707f1f77bcf86cd799439001', 'Unity Game Developer', 'Phát triển các trò chơi mobile và PC sử dụng Unity engine. Tham gia vào toàn bộ quy trình phát triển từ concept đến release. Tối ưu hóa performance và đảm bảo chất lượng trải nghiệm chơi game.', 'Yêu cầu: 2+ năm kinh nghiệm với Unity và C#. Có kinh nghiệm với Unity UI và physics. Hiểu biết về mobile game optimization. Đam mê games và hiểu biết về game design patterns. Kỹ năng teamwork tốt.', 'Game Developer', 2, 'TOAN_THỜI_GIAN', 'NHÂN_VIÊN', 15000000, 25000000, 'Quận 10, TP.HCM', 'TP.HCM', 'Việt Nam', FALSE, '1_2_NĂM', 'CAO_DANG', 'ĐANG_TUYỂN', 4, 67, FALSE, '2026-04-05 00:00:00'),
('907f1f77bcf86cd799439010', '807f1f77bcf86cd799439002', '707f1f77bcf86cd799439005', 'Junior Graphic Designer', 'Tạo nội dung visual hấp dẫn cho các chiến dịch marketing của StartupVN. Thiết kế graphics cho social media, website và tài liệu marketing. Hỗ trợ team design trong các dự án đa dạng.', 'Yêu cầu: Fresher hoặc 1+ năm kinh nghiệm. Thành thạo Photoshop, Illustrator. Có portfolio thể hiện creative skills. Eye for detail và sense of aesthetics. Kỹ năng quản lý thời gian tốt.', 'Graphic Designer', 1, 'TOAN_THỜI_GIAN', 'MỚI_TỐT_NGHIỆP', 8000000, 12000000, 'Nam Từ Liêm, Hà Nội', 'Hà Nội', 'Việt Nam', FALSE, 'KHÔNG_YÊU_CẦU', 'TRUNG_CAP', 'ĐANG_TUYỂN', 2, 34, FALSE, '2026-04-05 00:00:00');

-- =============================================
-- HỒ SƠ (HoSo)
-- =============================================
DROP TABLE IF EXISTS hoso;
CREATE TABLE hoso (
    id VARCHAR(36) PRIMARY KEY,
    nguoiDungId VARCHAR(36) UNIQUE NOT NULL,
    hoVaTen VARCHAR(100),
    ngaySinh DATE,
    gioiTinh ENUM('NAM', 'NU', 'KHAC') NULL,
    diaChi VARCHAR(200),
    tinhThanh VARCHAR(100),
    quocGia VARCHAR(100) DEFAULT 'Việt Nam',
    soDienThoai VARCHAR(20),
    gioiThieuBanThan TEXT,
    cvUrl VARCHAR(500),
    trangThaiHoSo ENUM('RIENG_TU', 'CONG_KHAI', 'DANG_TIEM_NANG') DEFAULT 'CONG_KHAI',
    daXem INT DEFAULT 0,
    luotLuu INT DEFAULT 0,
    ngayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngayCapNhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nguoiDungId (nguoiDungId)
);

INSERT INTO hoso (id, nguoiDungId, hoVaTen, ngaySinh, gioiTinh, diaChi, tinhThanh, quocGia, soDienThoai, gioiThieuBanThan, cvUrl, trangThaiHoSo, daXem, luotLuu) VALUES
('607f1f77bcf86cd799439014', '507f1f77bcf86cd799439014', 'Nguyễn Văn Cường', '1995-03-15', 'NAM', '123 Đường Nguyễn Trãi, Quận 1', 'TP.HCM', 'Việt Nam', '0934567890', 'Lập trình viên full-stack với 5+ năm kinh nghiệm phát triển web applications. Thành thạo React, Node.js, Python và các công nghệ cloud. Đam mê viết code sạch, maintainable và có khả năng làm việc độc lập hoặc trong team. Tìm kiếm cơ hội phát triển tại môi trường công nghệ năng động.', 'https://example.com/cvs/nguyencuong.pdf', 'CONG_KHAI', 45, 12),
('607f1f77bcf86cd799439015', '507f1f77bcf86cd799439015', 'Phạm Thị Thúy', '1998-07-22', 'NU', '456 Đường Lê Lợi, Quận 5', 'TP.HCM', 'Việt Nam', '0945678901', 'Cử nhân Marketing với kiến thức vững về digital marketing và social media. Đã thực tập tại các agency lớn, có kinh nghiệm chạy quảng cáo Facebook, Google Ads. Thích thú với việc tạo content sáng tạo và muốn phát triển sự nghiệp trong lĩnh vực marketing.', 'https://example.com/cvs/phamthuy.pdf', 'CONG_KHAI', 32, 8),
('607f1f77bcf86cd799439016', '507f1f77bcf86cd799439016', 'Hoàng Văn Hiếu', '1997-11-10', 'NAM', '789 Đường Trần Hưng Đạo, Quận 7', 'TP.HCM', 'Việt Nam', '0956789012', 'Sinh viên mới tốt nghiệp ngành Khoa học Máy tính, Đại học Bách Khoa TP.HCM. Có nền tảng vững về lập trình Java, Python và C++. Muốn bắt đầu sự nghiệp với vị trí fresher, sẵn sàng học hỏi và phát triển kỹ năng. Đam mê AI và machine learning.', 'https://example.com/cvs/hoanghieu.pdf', 'CONG_KHAI', 18, 5);

-- =============================================
-- ỨNG TUYỂN (UngTuyen)
-- =============================================
DROP TABLE IF EXISTS ungtuyen;
CREATE TABLE ungtuyen (
    id VARCHAR(36) PRIMARY KEY,
    viecLamId VARCHAR(36) NOT NULL,
    ungVienId VARCHAR(36) NOT NULL,
    cvUrl VARCHAR(500) NOT NULL,
    loaiCv ENUM('PDF', 'DOC', 'DOCX', 'LINK') NULL,
    thuXinViec TEXT,
    hoVaTen VARCHAR(100),
    email VARCHAR(255),
    soDienThoai VARCHAR(20),
    trangThai ENUM('DA_NOP', 'DANG_XEM', 'TRUNG_TUYEN', 'TUYEN_THANG', 'TU_CHOI', 'RUT_HO_SO') DEFAULT 'DA_NOP',
    ngayNop DATETIME DEFAULT CURRENT_TIMESTAMP,
    ngayXem DATETIME,
    ngayHenPhongVan DATETIME,
    ngayTraLoi DATETIME,
    lyDoTuChoi VARCHAR(500),
    ghiChu TEXT,
    diemDanhGia DECIMAL(2,1),
    nhanXet VARCHAR(1000),
    UNIQUE KEY unique_vieclam_ungvien (viecLamId, ungVienId),
    INDEX idx_viecLamId (viecLamId),
    INDEX idx_ungVienId (ungVienId),
    INDEX idx_trangThai (trangThai)
);

INSERT INTO ungtuyen (id, viecLamId, ungVienId, cvUrl, loaiCv, thuXinViec, hoVaTen, email, soDienThoai, trangThai, ngayNop, ngayXem) VALUES
('807f1f77bcf86cd799439001', '907f1f77bcf86cd799439001', '507f1f77bcf86cd799439014', 'https://example.com/cvs/nguyencuong.pdf', 'PDF', 'Kính gửi TechCorp, tôi rất quan tâm đến vị trí Senior React Developer. Với 5 năm kinh nghiệm với React và TypeScript, tôi tin rằng mình có thể đóng góp tích cực vào đội ngũ của bạn. Tôi đặc biệt ấn tượng với các dự án ERP và thương mại điện tử mà TechCorp đã triển khai.', 'Nguyễn Văn Cường', 'nguyenvancuong@email.com', '0934567890', 'DANG_XEM', '2026-04-01 10:30:00', '2026-04-02 14:00:00'),
('807f1f77bcf86cd799439002', '907f1f77bcf86cd799439002', '507f1f77bcf86cd799439014', 'https://example.com/cvs/nguyencuong.pdf', 'PDF', 'Kính gửi TechCorp, tôi muốn ứng tuyển vị trí Backend Node.js Developer. Với kinh nghiệm 3 năm với Node.js và Express, cùng với kiến thức về microservices architecture, tôi hy vọng có thể mang đến giá trị cho đội ngũ backend của bạn.', 'Nguyễn Văn Cường', 'nguyenvancuong@email.com', '0934567890', 'DA_NOP', '2026-04-02 09:00:00', NULL),
('807f1f77bcf86cd799439003', '907f1f77bcf86cd799439005', '507f1f77bcf86cd799439015', 'https://example.com/cvs/phamthuy.pdf', 'PDF', 'Kính gửi TechCorp, tôi rất hứng thú với vị trí Full-stack Developer. Dù mới ra trường nhưng tôi đã có dự án cá nhân với React và Node.js. Tôi nhanh chóng học hỏi và muốn phát triển trong môi trường chuyên nghiệp tại TechCorp.', 'Phạm Thị Thúy', 'phamthithuy@email.com', '0945678901', 'TRUNG_TUYEN', '2026-04-03 11:00:00', '2026-04-04 10:00:00'),
('807f1f77bcf86cd799439004', '907f1f77bcf86cd799439003', '507f1f77bcf86cd799439014', 'https://example.com/cvs/nguyencuong.pdf', 'PDF', 'Kính gửi StartupVN, tôi ấn tượng với các sản phẩm AI của công ty và muốn tham gia đội ngũ ML. Dù kinh nghiệm chưa nhiều nhưng tôi đã hoàn thành nhiều khóa học về ML và có project cá nhân với TensorFlow.', 'Nguyễn Văn Cường', 'nguyenvancuong@email.com', '0934567890', 'TU_CHOI', '2026-04-03 08:00:00', '2026-04-04 09:00:00');

-- =============================================
-- PHỎNG VẤN (PhongVan)
-- =============================================
DROP TABLE IF EXISTS phongvan;
CREATE TABLE phongvan (
    id VARCHAR(36) PRIMARY KEY,
    ungTuyenId VARCHAR(36) NOT NULL,
    ngayPhongVan DATETIME NOT NULL,
    thoiGianBatDau VARCHAR(10),
    thoiGianKetThuc VARCHAR(10),
    thoiLuong INT,
    diaDiem VARCHAR(300),
    diaDiemCuThe VARCHAR(500),
    linkHop VARCHAR(500),
    loaiPhongVan ENUM('TRUC_TIEP', 'VIDEO', 'DIEN_THOAI', 'THEO_GIO_HAN') DEFAULT 'TRUC_TIEP',
    nguoiPhongVan VARCHAR(200),
    emailNguoiPhongVan VARCHAR(255),
    soDienThoaiNguoiPhongVan VARCHAR(20),
    vong INT DEFAULT 1,
    tenVong VARCHAR(50),
    trangThai ENUM('CHƯA_DIỄN_RA', 'ĐÃ_HOÀN_TẤT', 'ĐÃ_HỦY', 'CẦN_DỜI_LẠI') DEFAULT 'CHƯA_DIỄN_RA',
    ketQua ENUM('DAT', 'KHONG_DAT', 'CAN_XEM_XET_LAI', 'CHUA_XAC_DINH') DEFAULT 'CHUA_XAC_DINH',
    nhanXet VARCHAR(2000),
    diemDanhGia DECIMAL(2,1),
    ngayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngayCapNhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ungTuyenId (ungTuyenId),
    INDEX idx_ngayPhongVan (ngayPhongVan),
    INDEX idx_trangThai (trangThai)
);

INSERT INTO phongvan (id, ungTuyenId, ngayPhongVan, thoiGianBatDau, thoiGianKetThuc, thoiLuong, diaDiem, linkHop, loaiPhongVan, nguoiPhongVan, vong, trangThai, ketQua) VALUES
('707f1f77bcf86cd799439001', '807f1f77bcf86cd799439001', '2026-04-10 09:00:00', '09:00', '10:00', 60, 'Phòng họp 501, Tòa nhà Bitexco, Quận 1, TP.HCM', NULL, 'TRUC_TIEP', 'Trần Thị Hương - Tech Lead', 1, 'CHƯA_DIỄN_RA', 'CHUA_XAC_DINH'),
('707f1f77bcf86cd799439002', '807f1f77bcf86cd799439003', '2026-04-11 14:00:00', '14:00', '14:30', 30, NULL, 'https://meet.google.com/abc-defg-hij', 'VIDEO', 'Lê Hoàng Nam - Head of Engineering', 1, 'CHƯA_DIỄN_RA', 'CHUA_XAC_DINH');

-- =============================================
-- BÀI VIẾT (BaiViet)
-- =============================================
DROP TABLE IF EXISTS baiviet;
CREATE TABLE baiviet (
    id VARCHAR(36) PRIMARY KEY,
    tacGiaId VARCHAR(36) NOT NULL,
    tieuDe VARCHAR(200) NOT NULL,
    noiDung TEXT NOT NULL,
    tomTat VARCHAR(500),
    hinhAnhDaiDien VARCHAR(500),
    hinhAnhBia VARCHAR(500),
    videoUrl VARCHAR(500),
    slug VARCHAR(200) UNIQUE,
    tuKhoa VARCHAR(200),
    theTags TEXT,
    danhMuc VARCHAR(100),
    trangThai ENUM('NHÁP', 'ĐÃ_XUẤT_BẢN', 'ĐÃ_ẨN', 'LƯU_NHÁP') DEFAULT 'ĐÃ_XUẤT_BẢN',
    hienThi ENUM('CONG_KHAI', 'CHI_NHOM', 'RIENG_TU') DEFAULT 'CONG_KHAI',
    daDuyet BOOLEAN DEFAULT FALSE,
    ngayDuyet DATETIME,
    nguoiDuyetId VARCHAR(36),
    ngayXuatBan DATETIME,
    ngayCapNhatLanCuoi DATETIME,
    soLuotXem INT DEFAULT 0,
    soLuotThich INT DEFAULT 0,
    soBinhLuan INT DEFAULT 0,
    soChiaSe INT DEFAULT 0,
    baiNoiBat BOOLEAN DEFAULT FALSE,
    choPhepBinhLuan BOOLEAN DEFAULT TRUE,
    hoVaTenTacGia VARCHAR(100),
    avatarTacGia VARCHAR(500),
    ngayTao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngayCapNhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_tacGiaId (tacGiaId),
    INDEX idx_slug (slug),
    INDEX idx_trangThai (trangThai),
    INDEX idx_ngayXuatBan (ngayXuatBan)
);

INSERT INTO baiviet (id, tacGiaId, tieuDe, noiDung, tomTat, hinhAnhDaiDien, slug, tuKhoa, theTags, danhMuc, trangThai, hienThi, daDuyet, ngayDuyet, nguoiDuyetId, ngayXuatBan, soLuotXem, soLuotThich, soBinhLuan, soChiaSe, baiNoiBat, hoVaTenTacGia) VALUES
('c07f1f77bcf86cd799439001', '507f1f77bcf86cd799439012', 'Cách xây dựng kiến trúc Microservices có thể mở rộng', '<p>Trong bài viết này, tôi sẽ chia sẻ kinh nghiệm của TechCorp Việt Nam trong việc chuyển đổi từ monolithic application sang kiến trúc Microservices. Đây là hành trình không dễ dàng nhưng đã mang lại nhiều lợi ích to lớn cho hệ thống của chúng tôi.</p><h2>Tại sao chúng tôi quyết định chuyển đổi?</h2><p>Khi ứng dụng của TechCorp phát triển, chúng tôi bắt đầu gặp những vấn đề nan giải với kiến trúc monolith. Team của chúng tôi có hơn 50 developer làm việc trên cùng một codebase khổng lồ. Mỗi lần deploy đều là một cơn ác mộng vì một thay đổi nhỏ cũng có thể ảnh hưởng đến toàn bộ hệ thống.</p><p>Thời gian khởi động ứng dụng ngày càng chậm, việc testing trở nên phức tạp và việc mở rộng quy mô gặp nhiều khó khăn. Chúng tôi nhận ra rằng đã đến lúc cần thay đổi.</p><h2>Bước đầu tiên - Phân tích và lập kế hoạch</h2><p>Trước khi bắt đầu, chúng tôi đã thực hiện một cuộc phân tích kỹ lưỡng để xác định các bounded context trong hệ thống. Chúng tôi sử dụng Domain-Driven Design để giúp xác định các domain riêng biệt như: quản lý đơn hàng, quản lý kho hàng, thanh toán, và chăm sóc khách hàng.</p><p>Mỗi microservice được thiết kế để có trách nhiệm rõ ràng và độc lập với các service khác. Chúng tôi cũng xác định các API contract trước khi bắt đầu phát triển để đảm bảo các team có thể làm việc song song.</p><h2>Công nghệ và công cụ</h2><p>TechCorp sử dụng Docker và Kubernetes cho containerization và orchestration. Điều này giúp chúng tôi dễ dàng scale các service một cách độc lập theo nhu cầu thực tế.</p><p>Về giao tiếp giữa các services, chúng tôi sử dụng kết hợp RESTful API cho các tác vụ đồng bộ và Apache Kafka cho các tác vụ bất đồng bộ. Điều này giúp giảm thiểu coupling giữa các services.</p><h2>Những thách thức chúng tôi đã gặp</h2><p>Việc chuyển đổi không phải lúc nào cũng suôn sẻ. Một trong những thách thức lớn nhất là quản lý distributed transactions. Trong monolith, chúng tôi có thể sử dụng database transactions đơn giản, nhưng trong microservices, chúng tôi phải sử dụng saga pattern.</p><p>Một thách thức khác là monitoring và debugging. Với nhiều services chạy độc lập, việc trace một request từ đầu đến cuối trở nên phức tạp hơn. Chúng tôi đã triển khai distributed tracing với Jaeger và centralized logging với ELK stack.</p><h2>Kết quả đạt được</h2><p>Sau 18 tháng chuyển đổi, TechCorp đã đạt được những kết quả ấn tượng: Thời gian deploy giảm từ 2 giờ xuống còn 15 phút. Có thể scale độc lập từng service theo nhu cầu. Team có thể phát triển và release tính năng mới nhanh hơn 3 lần. System uptime tăng lên 99.9%.</p><h2>Kết luận</h2><p>Việc chuyển đổi sang microservices là một quyết định lớn và không phải lúc nào cũng phù hợp với mọi tổ chức. Tuy nhiên, nếu được thực hiện đúng cách với lập kế hoạch cẩn thận, nó có thể mang lại những lợi ích to lớn cho khả năng mở rộng và tốc độ phát triển của đội ngũ.</p>', 'Chia sẻ kinh nghiệm chuyển đổi từ monolith sang microservices tại TechCorp Việt Nam - từ những thách thức đến kết quả ấn tượng', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop', 'cach-xay-dung-kien-truc-microservices-co-the-mo-rong', 'microservices, architecture, devops, cloud', 'Microservices,Architecture,DevOps,Cloud', 'Công nghệ', 'ĐÃ_XUẤT_BẢN', 'CONG_KHAI', TRUE, '2026-03-15 00:00:00', '507f1f77bcf86cd799439011', '2026-03-15 00:00:00', 1250, 89, 23, 45, TRUE, 'Trần Thị Hương'),

('c07f1f77bcf86cd799439002', '507f1f77bcf86cd799439013', 'Bắt đầu với Machine Learning trong Production - Hướng dẫn toàn diện', '<p>Machine Learning đã trở thành một phần không thể thiếu trong các sản phẩm công nghệ hiện đại. Tuy nhiên, việc đưa ML models từ Jupyter notebook ra production là một thách thức lớn mà nhiều kỹ sư gặp phải. Trong bài viết này, tôi sẽ hướng dẫn các bạn quy trình để triển khai ML trong production một cách hiệu quả.</p><h2>Từ Notebook đến Production</h2><p>Nhiều data scientist bắt đầu với Jupyter notebook - một công cụ tuyệt vời cho việc exploration và experimentation. Nhưng khi cần đưa model vào production, họ nhận ra rằng notebook không phải là môi trường phù hợp. Code trong notebook thường messy, khó test và không có cấu trúc rõ ràng.</p><p>Đầu tiên, bạn cần tách biệt code training và code inference. Model training nên được thực hiện trong một pipeline riêng, có thể sử dụng các công cụ như MLflow hoặc Kubeflow Pipelines.</p><h2>Xây dựng ML Pipeline</h2><p>Một ML pipeline hoàn chỉnh bao gồm nhiều bước: data collection, data preprocessing, feature engineering, model training, model evaluation, và model deployment. Mỗi bước cần được automated và có khả năng retry khi gặp lỗi.</p><p>Tại StartupVN, chúng tôi sử dụng Apache Airflow để orchestrate các ML pipelines. Điều này giúp chúng tôi dễ dàng schedule retraining, monitor performance và rollback khi cần thiết.</p><h2>Model Serving</h2><p>Có nhiều cách để serve ML models trong production: REST API cho đơn giản nhưng có độ trễ cao hơn, gRPC nhanh hơn REST phù hợp cho internal services, Batch prediction để xử lý nhiều predictions cùng lúc phù hợp cho offline inference, Streaming prediction sử dụng message queues phù hợp cho real-time applications.</p><p>Chúng tôi thường sử dụng kết hợp REST API cho các use cases đơn giản và batch prediction cho các tác vụ phức tạp hơn.</p><h2>Monitoring và Maintenance</h2><p>ML models không chỉ cần được deploy mà còn cần được monitor liên tục. Một model có thể degrade theo thời gian khi data distribution thay đổi. Vì vậy, việc setup monitoring cho model performance là vô cùng quan trọng.</p><p>Chúng tôi track các metrics như prediction latency, error rate, và most importantly, business metrics để đảm bảo model đang hoạt động tốt. Khi performance giảm xuống dưới ngưỡng, alert sẽ được trigger và đội ngũ sẽ tiến hành retrain model.</p><h2>MLOps Best Practices</h2><p>Để quản lý ML infrastructure hiệu quả, chúng tôi áp dụng các MLOps practices: Version control cho cả code, data và models. Automated testing cho ML pipelines. Documentation rõ ràng cho các experiments. Collaboration giữa data scientists và ML engineers.</p><h2>Kết luận</h2><p>Việc triển khai ML trong production đòi hỏi nhiều hơn chỉ model development. Nó cần một hệ thống hoàn chỉnh để handle data, training, deployment và monitoring. Hy vọng bài viết này đã cung cấp cho các bạn những kiến thức cơ bản để bắt đầu hành trình MLOps của mình.</p>', 'Hướng dẫn triển khai ML models từ notebook sang production với MLOps best practices - từ pipeline design đến monitoring', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop', 'bat-dau-voi-machine-learning-trong-production', 'machine learning, mlops, production, python', 'Machine Learning,MLOps,Production,Python', 'AI & Data', 'ĐÃ_XUẤT_BẢN', 'CONG_KHAI', TRUE, '2026-03-20 00:00:00', '507f1f77bcf86cd799439011', '2026-03-20 00:00:00', 890, 67, 15, 28, TRUE, 'Lê Hoàng Nam'),

('c07f1f77bcf86cd799439003', '507f1f77bcf86cd799439014', '5 mẹo tối ưu hiệu suất React application', '<p>Là một lập trình viên React với 5 năm kinh nghiệm, tôi đã rút ra nhiều bài học về việc tối ưu hiệu suất ứng dụng. Trong bài viết này, tôi muốn chia sẻ 5 mẹo quan trọng nhất mà bất kỳ React developer nào cũng nên biết.</p><h2>1. Sử dụng React.memo một cách hiệu quả</h2><p>React.memo là một higher-order component giúp prevent unnecessary re-renders. Tuy nhiên, nhiều developers sử dụng nó không đúng cách, dẫn đến việc tối ưu không hiệu quả hoặc thậm chí gây ra bugs.</p><p>Chỉ sử dụng React.memo khi component của bạn thường xuyên nhận cùng một props và việc re-render tốn kém về mặt tính toán. Đừng lạm dụng nó vì React.memo cũng có overhead cho việc so sánh props.</p><h2>2. Lazy loading components</h2><p>Với các ứng dụng lớn, không nên load tất cả components ngay từ đầu. Sử dụng React.lazy và Suspense để code-split và chỉ load components khi cần thiết.</p><p>Kỹ thuật này đặc biệt hiệu quả cho các trang ít được truy cập hoặc các component nặng như charts, editors, hay maps.</p><h2>3. Virtualize long lists</h2><p>Nếu bạn có một danh sách dài cần render hàng trăm hoặc hàng nghìn items, đừng render tất cả cùng lúc. Sử dụng react-window hoặc react-virtualized để chỉ render những items đang hiển thị trên màn hình.</p><p>Với danh sách 10.000 items, kỹ thuật này có thể giảm thời gian render từ vài giây xuống còn vài miliseconds.</p><h2>4. Tránh anonymous functions trong JSX</h2><p>Một mistake phổ biến là passing anonymous functions như callbacks. Anonymous functions tạo ra reference mới mỗi lần parent component re-render, khiến child components cũng phải re-render không cần thiết.</p><p>Thay vào đó, hãy định nghĩa callbacks bên ngoài JSX hoặc sử dụng useCallback hook.</p><h2>5. Optimize useEffect dependencies</h2><p>useEffect với dependencies không chính xác là nguồn gốc của nhiều bugs và performance issues. Hãy chắc chắn rằng bạn hiểu rõ cách ESLint react-hooks/exhaustive-deps rule hoạt động.</p><p>Tách biệt các effects theo concerns khác nhau để tránh dependencies phức tạp.</p><h2>Kết luận</h2><p>Performance optimization là một quá trình liên tục. Hãy sử dụng React DevTools Profiler để identify bottlenecks và chỉ tối ưu khi có vấn đề thực sự. Đừng over-engineer từ đầu - hãy để profiling guide bạn đến những nơi cần cải thiện nhất.</p>', 'Những mẹo tối ưu hiệu suất React application mà tôi đã học được qua kinh nghiệm làm việc với các ứng dụng lớn', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop', '5-meo-toi-uu-hieu-suat-react', 'react, performance, optimization, frontend', 'React,Performance,Optimization,Frontend', 'Công nghệ', 'ĐÃ_XUẤT_BẢN', 'CONG_KHAI', TRUE, '2026-03-25 00:00:00', '507f1f77bcf86cd799439011', '2026-03-25 00:00:00', 2340, 156, 42, 78, FALSE, 'Nguyễn Văn Cường'),

('c07f1f77bcf86cd799439004', '507f1f77bcf86cd799439016', 'Tương lai của ngành Thiết kế UI/UX tại Việt Nam', '<p>Ngành thiết kế UI/UX tại Việt Nam đang phát triển nhanh chóng và có nhiều tiềm năng to lớn. Trong bài viết này, tôi muốn chia sẻ những nhận định của mình về xu hướng hiện tại và tương lai của ngành này.</p><h2>Bối cảnh ngành hiện nay</h2><p>Trong 5 năm qua, nhu cầu về UX designers tại Việt Nam đã tăng gấp 5 lần. Các công ty công nghệ, startup, và даже các doanh nghiệp truyền thống đều nhận ra tầm quan trọng của trải nghiệm người dùng trong việc tạo ra sản phẩm thành công.</p><p>Tuy nhiên, vẫn còn một khoảng cách lớn về chất lượng giữa Việt Nam và các nước phát triển. Nhiều designers vẫn tập trung vào thẩm mỹ mà bỏ qua nghiên cứu người dùng và data-driven design.</p><h2>Các xu hướng nổi bật</h2><h3>1. Design Systems</h3><p>Ngày càng nhiều công ty Việt Nam xây dựng design systems riêng để đảm bảo consistency across products. Điều này đòi hỏi designers không chỉ có kỹ năng design mà còn cần hiểu về component architecture và frontend development.</p><h3>2. Research-driven Design</h3><p>Thay vì design dựa trên intuition, các công ty hàng đầu bắt đầu đầu tư vào user research một cách nghiêm túc. UX research đang trở thành một role riêng biệt, không chỉ là task phụ của designer.</p><h3>3. Accessibility</h3><p>Với việc Chính phủ Việt Nam ban hành các quy định về accessibility, design for all không còn là optional. Designers cần nắm vững WCAG guidelines và biết cách thiết kế cho người khuyết tật.</p><h2>Cơ hội cho designers trẻ</h2><p>Việt Nam đang thiếu hụt nhân lực UX có trình độ cao. Điều này có nghĩa là các bạn trẻ mới vào nghề có cơ hội phát triển sự nghiệp nhanh chóng nếu chịu khó học hỏi và trau dồi kỹ năng.</p><p>Một số kỹ năng quan trọng mà tôi khuyên các bạn nên phát triển: Figma và các công cụ design hiện đại, Basic coding skills, User research và usability testing, Data analysis và interpretation, Motion design và prototyping.</p><h2>Kết luận</h2><p>Ngành UI/UX design tại Việt Nam có tương lai rất tươi sáng. Với sự phát triển của startup ecosystem và digital transformation, nhu cầu về designers chất lượng sẽ tiếp tục tăng. Điều quan trọng là các designers phải không ngừng học hỏi, cập nhật xu hướng mới, và quan trọng nhất là luôn đặt người dùng vào trung tâm của mọi quyết định thiết kế.</p>', 'Những xu hướng và cơ hội trong ngành UI/UX Design tại Việt Nam - từ design systems đến accessibility', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop', 'tuong-lai-ui-ux-design-tai-viet-nam', 'ui/ux, design, vietnam, trends', 'UI/UX,Design,Vietnam,Trends', 'Design', 'ĐÃ_XUẤT_BẢN', 'CONG_KHAI', TRUE, '2026-04-01 00:00:00', '507f1f77bcf86cd799439011', '2026-04-01 00:00:00', 1560, 112, 38, 56, FALSE, 'Hoàng Văn Hiếu'),

('c07f1f77bcf86cd799439005', '507f1f77bcf86cd799439011', 'Hướng dẫn quản trị viên - Quản lý nội dung trên cổng thông tin tuyển dụng', '<p>Để đảm bảo cổng thông tin tuyển dụng hoạt động hiệu quả và cung cấp giá trị cho người dùng, việc quản lý nội dung là vô cùng quan trọng. Trong bài viết này, tôi sẽ hướng dẫn các quản trị viên cách quản lý nội dung một cách hiệu quả.</p><h2>Vai trò của quản trị viên</h2><p>Quản trị viên hệ thống có trách nhiệm đảm bảo chất lượng nội dung trên platform. Điều này bao gồm: Duyệt và xóa các tin tuyển dụng không hợp lệ, Xác minh thông tin công ty, Quản lý danh mục và tags, Xử lý khiếu nại và báo cáo từ người dùng, Theo dõi và phân tích hoạt động của platform.</p><h2>Quản lý tin tuyển dụng</h2><h3>Duyệt tin mới</h3><p>Khi một công ty đăng tin mới, quản trị viên cần kiểm tra: Thông tin công ty đã được xác minh chưa, Nội dung tin không vi phạm policies, Mức lương và điều kiện tuyển dụng hợp lý, Không có nội dung phân biệt đối xử.</p><h3>Xử lý tin vi phạm</h3><p>Nếu phát hiện tin vi phạm, quản trị viên có các lựa chọn: Từ chối duyệt - tin sẽ không hiển thị và công ty được thông báo lý do, Yêu cầu chỉnh sửa - gửi phản hồi cho công ty với các thay đổi cần thiết, Tạm khóa - nếu vi phạm nghiêm trọng hoặc tái phát.</p><h2>Quản lý công ty</h2><p>Việc xác minh công ty là bước quan trọng để đảm bảo chất lượng platform. Các công ty cần cung cấp: Giấy phép kinh doanh hợp lệ, Thông tin liên hệ chính xác, Xác thực email doanh nghiệp. Quản trị viên có quyền duyệt hoặc từ chối công ty dựa trên các tiêu chí này.</p><h2>Quản lý người dùng</h2><p>Hệ thống có các vai trò người dùng: Ứng viên có thể đăng ký, tạo hồ sơ, ứng tuyển công việc, Nhà tuyển dụng có thể đăng tin, xem ứng viên, Quản trị viên có toàn quyền quản lý hệ thống. Quản trị viên có thể khóa hoặc xóa tài khoản vi phạm policies của platform.</p><h2>Báo cáo và Analytics</h2><p>Dashboard quản trị cung cấp các metrics quan trọng: Số lượng tin tuyển dụng mới theo ngày hoặc tuần hoặc tháng, Tỷ lệ ứng tuyển thành công, Top công ty tuyển dụng nhiều nhất, Các danh mục phổ biến nhất.</p><h2>Best Practices</h2><p>Duyệt tin trong vòng 24 giờ để đảm bảo trải nghiệm người dùng. Ghi chép lý do từ chối hoặc duyệt để tracking. Regularly update policies để phản ánh thực tế. Tạo communication channel với nhà tuyển dụng.</p><h2>Kết luận</h2><p>Việc quản trị nội dung hiệu quả là chìa khóa để xây dựng một nền tảng tuyển dụng chất lượng. Hy vọng hướng dẫn này giúp các quản trị viên mới có thể bắt đầu công việc một cách hiệu quả.</p>', 'Hướng dẫn chi tiết cách quản lý nội dung trên cổng thông tin tuyển dụng - từ duyệt tin đến xử lý vi phạm', 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop', 'huong-dan-quan-tri-vien-quan-ly-noi-dung', 'admin, guide, management, portal', 'Admin,Guide,Management,Portal', 'Quản trị', 'ĐÃ_XUẤT_BẢN', 'CONG_KHAI', TRUE, '2026-04-05 00:00:00', '507f1f77bcf86cd799439011', '2026-04-05 00:00:00', 567, 34, 12, 23, FALSE, 'Nguyễn Văn Minh');
