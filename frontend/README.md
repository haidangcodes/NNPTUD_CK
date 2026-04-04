# JobPortal Frontend

React frontend đọc từ API của BE tại http://localhost:3000

## Cài đặt

```bash
cd frontend
npm install
npm start
```

Frontend sẽ chạy tại http://localhost:3001

## Các trang

| Route | Mô tả | Role |
|-------|-------|------|
| `/` | Trang chủ | Public |
| `/jobs` | Danh sách việc làm | Public |
| `/jobs/:id` | Chi tiết việc làm | Public |
| `/login` | Đăng nhập | Public |
| `/register` | Đăng ký | Public |
| `/dashboard/candidate` | Dashboard ứng viên | CANDIDATE |
| `/dashboard/recruiter` | Dashboard nhà tuyển dụng | RECRUITER |
| `/dashboard/admin` | Dashboard admin | ADMIN |

## API Integration

Frontend kết nối với BE tại `http://localhost:3000/api`

### Services
- `authService` - register, login
- `jobService` - CRUD việc làm
- `companyService` - CRUD công ty
- `applicationService` - ứng tuyển, quản lý đơn
- `categoryService` - CRUD danh mục (admin)
- `blogService` - CRUD blog (admin)
- `profileService` - profile ứng viên
- `uploadService` - upload CV, ảnh
- `interviewService` - quản lý phỏng vấn

## Lưu ý

- Token JWT được lưu trong localStorage
- Auto-redirect dựa trên role khi đăng nhập
- Cần BE chạy tại localhost:3000 trước
