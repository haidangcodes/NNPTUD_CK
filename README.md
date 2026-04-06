# Cổng Thông Tin Tuyển Dụng - Job Portal

Hệ thống tuyển dụng đầy đủ tính năng với Node.js, Express, MySQL và React.

## Stack

- **Backend**: Node.js + Express + MySQL (mysql2)
- **Frontend**: React + React Router + Axios
- **Database**: MySQL Workbench
- **Authentication**: JWT

## Cài Đặt

### Backend

```bash
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Chạy Server

### Backend (Port 3000)

```bash
npm start        # Production
npm run dev      # Development với nodemon
```

### Frontend (Port 3001)

```bash
cd frontend
npm start
```

## Tài Khoản Mẫu

| Vai trò | Email | Mật khẩu |
|---------|-------|-----------|
| **QUẢN TRỊ** (Admin) | admin@jobportal.vn | password123 |
| **TUYỂN DỤNG** (Recruiter) | tuyendung@techcorp.com | password123 |
| **TUYỂN DỤNG** (Recruiter) | tuyendung@startupvn.vn | password123 |
| **ỨNG VIÊN** (Candidate) | nguyenvancuong@email.com | password123 |
| **ỨNG VIÊN** (Candidate) | phamthithuy@email.com | password123 |

> **Lưu ý**: Tất cả mật khẩu đều là `password123`

## Môi Trường

Tạo file `.env` trong thư mục gốc:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=jobportal
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

## Database

1. Mở **MySQL Workbench**
2. Chạy file `database.sql` để tạo database và dữ liệu mẫu

## Cấu Trúc Thư Mục

```
CK-NNPTUD/
├── bin/www                    # Entry point - kết nối database, start server
├── app.js                     # Express app - middleware, routes, CORS
├── utils/
│   ├── db.js                  # MySQL connection pool (mysql2/promise)
│   └── authHandler.js         # JWT utilities (generateToken, verifyToken, checkRole)
├── controllers/               # Business logic - 1 file per resource
│   ├── authController.js      # Đăng ký, đăng nhập
│   ├── jobController.js      # CRUD việc làm
│   ├── companyController.js   # CRUD công ty
│   ├── applicationController.js  # Ứng tuyển, quản lý đơn
│   ├── interviewController.js # Lên lịch phỏng vấn
│   ├── blogController.js     # CRUD bài viết
│   ├── categoryController.js  # CRUD danh mục
│   ├── profileController.js   # Profile ứng viên
│   └── uploadController.js    # Upload CV, ảnh
├── routes/                    # Express routers - mount controllers
├── middleware/
│   └── auth.js                # verifyToken middleware
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── App.js             # Router, Navigation, ProtectedRoute
│   │   ├── context/
│   │   │   └── AuthContext.js # Auth state (login, logout, user)
│   │   ├── services/
│   │   │   └── api.js         # Axios instance, service modules
│   │   └── pages/             # Page components
│   └── public/
└── database.sql               # MySQL schema + seed data
```

## Luồng Hoạt Động

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│    ┌──────────┐    ┌──────────┐    ┌──────────────────────────┐ │
│    │  Login   │───▶│ AuthCtx  │───▶│  localStorage (token)   │ │
│    └──────────┘    └────┬─────┘    └──────────────────────────┘ │
│                       JWT saved                                   │
└──────────────────────────────┬────────────────────────────────────┘
                               │ Authorization header
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                      SERVER (Express :3000)                       │
│                                                                  │
│  ┌────────┐     ┌─────────────┐     ┌────────────────────────┐  │
│  │ Routes │────▶│ Middleware  │────▶│ Controllers (SQL)      │  │
│  └────────┘     │ verifyToken │     │                        │  │
│                 └─────────────┘     │ pool.execute(query)    │  │
│                                      └───────────┬────────────┘  │
└──────────────────────────────────────────────────┼──────────────┘
                                                   │
                                                   ▼
                                        ┌──────────────────────┐
                                        │   MySQL Database     │
                                        │   (jobportal)        │
                                        └──────────────────────┘
```

## API Endpoints

### Authentication

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/api/auth/register` | Đăng ký tài khoản mới |
| POST | `/api/auth/login` | Đăng nhập, nhận JWT token |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại |

### Jobs (Việc làm)

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/jobs` | Danh sách việc làm (phân trang, lọc) |
| GET | `/api/jobs/:id` | Chi tiết việc làm |
| POST | `/api/jobs` | Đăng tin tuyển dụng (Recruiter) |
| PUT | `/api/jobs/:id` | Cập nhật tin (Recruiter/Admin) |
| DELETE | `/api/jobs/:id` | Xóa tin (Recruiter/Admin) |
| GET | `/api/jobs/my` | Tin tuyển dụng của công ty tôi |

### Companies (Công ty)

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/companies` | Danh sách công ty |
| GET | `/api/companies/:id` | Chi tiết công ty |
| POST | `/api/companies/me` | Tạo profile công ty (Recruiter) |
| PUT | `/api/companies/:id` | Cập nhật công ty |
| PUT | `/api/companies/:id/approve` | Duyệt công ty (Admin) |

### Applications (Đơn ứng tuyển)

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/api/applications` | Ứng tuyển |
| GET | `/api/applications/me` | Lịch sử ứng tuyển (Candidate) |
| GET | `/api/applications/job/:jobId` | DS ứng viên (Recruiter) |
| PUT | `/api/applications/:id/status` | Cập nhật trạng thái |

### Interviews (Phỏng vấn)

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/api/interviews` | Tạo lịch phỏng vấn |
| GET | `/api/interviews/me` | Lịch phỏng vấn của tôi |
| PUT | `/api/interviews/:id` | Cập nhật phỏng vấn |
| DELETE | `/api/interviews/:id` | Xóa phỏng vấn |

### Categories (Danh mục - Admin)

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/categories` | Danh sách ngành nghề |
| POST | `/api/categories` | Tạo ngành nghề |
| PUT | `/api/categories/:id` | Sửa ngành nghề |
| DELETE | `/api/categories/:id` | Xóa ngành nghề |

### Blogs (Bài viết - Admin)

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/blogs` | Danh sách bài viết |
| GET | `/api/blogs/:id` | Chi tiết bài viết |
| POST | `/api/blogs` | Tạo bài viết |
| PUT | `/api/blogs/:id` | Sửa bài viết |
| DELETE | `/api/blogs/:id` | Xóa bài viết |

### Profiles (Hồ sơ ứng viên)

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/profiles/me` | Lấy hồ sơ của tôi |
| PUT | `/api/profiles/me` | Cập nhật hồ sơ |

### Upload

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/api/upload/cv` | Upload CV (PDF, max 5MB) |
| POST | `/api/upload/image` | Upload ảnh (JPG/PNG, max 2MB) |

## Response Format

```json
{
  "status": "success",
  "data": { ... },
  "message": "Thông báo thành công"
}
```

Error:
```json
{
  "status": "error",
  "message": "Mô tả lỗi"
}
```

## Phân Quyền

| Vai trò | Tiếng Việt | Quyền hạn |
|---------|------------|------------|
| `QUAN_TRI` | Quản trị viên | Categories, Blogs, Duyệt công ty, Full access |
| `TUYEN_DUNG` | Nhà tuyển dụng | Tạo công ty, CRUD việc làm, Quản lý đơn ứng tuyển |
| `UNG_VIEN` | Ứng viên | Tạo profile, Xem việc làm, Ứng tuyển, Xem lịch phỏng vấn |

## Logo Công Ty

Logo được lấy tự động từ **Clearbit API** dựa trên domain công ty:

```
https://logo.clearbit.com/techcorp.vn
https://logo.clearbit.com/startupvn.vn
...
```

Nếu Clearbit không có logo, có thể dùng **UI Avatars** làm fallback:

```
https://ui-avatars.com/api/?name=TechCorp&background=3D8B63&color=fff&size=128
```

## Hình Ảnh Blog

Blog sử dụng ảnh từ **Unsplash**:

```sql
https://images.unsplash.com/photo-xxxxx?w=800&h=400&fit=crop
```

## Công Nghệ Sử Dụng

### Backend
- express - Web framework
- mysql2 - MySQL driver (promise API)
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- multer - File upload
- cors - Cross-origin resource sharing
- dotenv - Environment variables

### Frontend
- react - UI library
- react-router-dom - Routing
- axios - HTTP client
- react-icons - Icon library

## Development Notes

- Backend chạy trên port **3000**
- Frontend dev server chạy trên port **3001**
- CORS được cấu hình cho phép both ports
- File uploads lưu trong `uploads/` folder
