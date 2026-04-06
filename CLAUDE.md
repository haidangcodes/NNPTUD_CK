# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Job Portal API (Vietnamese) — a full-stack job recruitment platform with Node.js/Express/MySQL backend and React frontend.

## Commands

### Backend
```bash
cd backend
npm install          # Install backend dependencies
npm start            # Production server (port 3000)
npm run dev          # Development with nodemon
```

### Frontend
```bash
cd frontend
npm install          # Install frontend dependencies
npm start            # Development server (port 3000/3001)
npm run build        # Production build
```

## Project Structure

```
CK-NNPTUD/
├── backend/           # Node.js/Express API
│   ├── app.js        # Express app config
│   ├── bin/www       # Server entry point
│   ├── controllers/  # Business logic
│   ├── routes/       # API routes
│   ├── utils/        # Helpers (auth, db, upload)
│   ├── schemas/      # Mongoose models (legacy, not used)
│   ├── uploads/     # Uploaded files (CV, images)
│   ├── database.sql  # MySQL schema & seed data
│   └── package.json  # Backend dependencies
│
├── frontend/         # React frontend
│   ├── src/
│   │   ├── pages/   # Page components
│   │   ├── services/ # API calls
│   │   ├── context/  # Auth state
│   │   └── App.js   # Router setup
│   └── package.json # Frontend dependencies
│
└── CLAUDE.md
```

## Architecture

### Backend Structure
- `bin/www` — Server entry point (connects to MySQL, starts Express)
- `app.js` — Express app configuration (middleware, routes, static files)
- `controllers/` — Business logic, one file per resource
- `routes/` — Express routers mounting controllers
- `utils/db.js` — MySQL connection pool (mysql2/promise)
- `utils/authHandler.js` — JWT utilities: `generateToken`, `verifyToken`, `checkRole`
- `uploads/` — Uploaded files (cvs/, images/)

### Frontend Structure
- `frontend/src/App.js` — React Router setup, ProtectedRoute component, Navigation
- `frontend/src/context/AuthContext.js` — Auth state management (login, register, logout, user)
- `frontend/src/services/api.js` — Axios instance with JWT interceptor, service modules
- `frontend/src/pages/` — Page components

### Database (MySQL)
Tables: `nguoidung`, `congty`, `vieclam`, `ungtuyen`, `phongvan`, `hoso`, `danhmuc`, `baiviet`

## Authentication Flow
1. User registers/logs in via authService
2. Backend returns JWT token + user object
3. Frontend stores token in localStorage, user in AuthContext
4. Axios interceptor attaches `Authorization: Bearer <token>` to all requests
5. Backend `verifyToken` middleware validates JWT on protected routes
6. Role-based access via `checkRole(...roles)` middleware

## API Response Format
```json
{ "status": "success", "data": {...}, "message": "..." }
```
Error: `{ "status": "error", "message": "..." }`

## Role Permissions
- **QUAN_TRI** (Admin) — Categories, Blogs, Company approval
- **TUYEN_DUNG** (Recruiter) — Company CRUD, Job CRUD, Application management, Interviews
- **UNG_VIEN** (Candidate) — Profile CRUD, view Jobs/Companies, Applications, Interviews

## Key Dependencies
- Backend: express, mysql2, jsonwebtoken, bcryptjs, multer, cors
- Frontend: react, react-router-dom, axios

## Ports
- Backend API: 3000
- Frontend dev: 3001
