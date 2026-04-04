# Job Portal API

RESTful API cho hệ thống tuyển dụng với Node.js, Express và MongoDB.

## Cài đặt

```bash
npm install
```

## Chạy server

```bash
npm start        # Chạy production
npm run dev      # Chạy development với nodemon
```

## Cấu trúc thư mục

```
├── bin/www              # Entry point
├── app.js               # Express app configuration
├── schemas/             # Mongoose schemas
├── controllers/         # Business logic
├── routes/              # API routes
├── utils/               # Middleware & helpers
├── uploads/             # Uploaded files
│   ├── cvs/
│   └── images/
└── resources/           # Static HTML files
```

## Môi trường

Tạo file `.env`:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký (CANDIDATE/RECRUITER)
- `POST /api/auth/login` - Đăng nhập

### Profiles (Candidate)
- `GET /api/profiles/me` - Lấy profile
- `PUT /api/profiles/me` - Cập nhật profile

### Companies
- `GET /api/companies` - Danh sách công ty
- `POST /api/companies/me` - Tạo profile công ty
- `PUT /api/companies/:id/approve` - Duyệt công ty (Admin)

### Categories (Admin)
- `GET /api/categories` - Danh sách ngành nghề
- `POST /api/categories` - Tạo ngành nghề
- `PUT /api/categories/:id` - Sửa ngành nghề
- `DELETE /api/categories/:id` - Xóa ngành nghề

### Jobs
- `GET /api/jobs` - Danh sách tin tuyển dụng (phân trang, lọc)
- `GET /api/jobs/:id` - Chi tiết tin tuyển dụng
- `POST /api/jobs` - Đăng tin (Recruiter)
- `PUT /api/jobs/:id` - Sửa tin
- `DELETE /api/jobs/:id` - Xóa tin

### Applications
- `POST /api/applications` - Ứng tuyển
- `GET /api/applications/me` - Lịch sử ứng tuyển
- `GET /api/applications/job/:jobId` - DS ứng viên (Recruiter)
- `PUT /api/applications/:id/status` - Cập nhật trạng thái

### Interviews
- `POST /api/interviews` - Lên lịch phỏng vấn
- `GET /api/interviews/me` - Lịch phỏng vấn

### Blogs (Admin)
- CRUD đầy đủ cho blog

### Upload
- `POST /api/upload/cv` - Upload CV (PDF)
- `POST /api/upload/image` - Upload ảnh (JPG/PNG)

## Response Format

```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation successful"
}
```

## Phân quyền

- **CANDIDATE**: Profile, Jobs (xem), Applications, Interviews (xem)
- **RECRUITER**: Company, Jobs (CRUD), Applications (quản lý), Interviews
- **ADMIN**: Categories, Blogs, Company approval, full access
