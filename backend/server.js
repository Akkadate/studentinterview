// backend/server.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

// Import routes
const interviewerRoutes = require("./routes/interviewerRoutes");
const studentRoutes = require("./routes/studentRoutes");
const questionRoutes = require("./routes/questionRoutes");
const interviewRoutes = require("./routes/interviewRoutes");

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(
  cors({
    // อนุญาต origin ทั้งหมดในโหมด development
    origin:
      process.env.NODE_ENV === "development"
        ? "*"
        : [
            process.env.FRONTEND_URL,
            "http://localhost:3003",
            "http://interview.devapp.cc:3003",
            "https://interview.devapp.cc:3003",
            "https://interview.devapp.cc",
            "http://interview.devapp.cc",
          ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// เพิ่ม middleware แสดงข้อมูลการร้องขอสำหรับการแก้ไขปัญหา
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Request Headers:", req.headers);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev")); // เพิ่ม logging เพื่อการพัฒนา

// Routes
app.use("/api/interviewers", interviewerRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/interviews", interviewRoutes);

// ปรับปรุง endpoint health check ให้แสดงข้อมูลเพิ่มเติม
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    corsSettings: {
      frontend_url: process.env.FRONTEND_URL,
      port: process.env.PORT,
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ใน backend/server.js
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is running",
  });
});

module.exports = app;
