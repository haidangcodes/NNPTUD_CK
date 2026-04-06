const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

dotenv.config();

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profiles');
const companyRoutes = require('./routes/companies');
const categoryRoutes = require('./routes/categories');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const interviewRoutes = require('./routes/interviews');
const blogRoutes = require('./routes/blogs');
const uploadRoutes = require('./routes/upload');

const app = express();

app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000', 'http://localhost:3005', 'http://localhost:3003'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadDirs = ['uploads/cvs', 'uploads/images'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`--- Đã tạo thư mục: ${dir}`);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.send({
    status: 'success',
    message: 'Job Portal API is running',
    version: '1.0.0'
  });
});

app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

module.exports = app;
