// backend/routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const {
  checkAuth,
  checkFacultyAccess,
} = require("../middleware/authMiddleware");

// เพิ่ม middleware ตรวจสอบสิทธิ์ในทุก route
router.get("/", checkAuth, studentController.getAllStudents);
router.get(
  "/faculty/:faculty",
  checkAuth,
  checkFacultyAccess,
  studentController.getStudentsByFaculty
);
router.get(
  "/program/:program",
  checkAuth,
  studentController.getStudentsByProgram
);
router.get(
  "/not-interviewed",
  checkAuth,
  studentController.getNotInterviewedStudents
);
router.get("/summary", checkAuth, studentController.getInterviewStatusSummary);
router.get(
  "/:id",
  checkAuth,
  checkFacultyAccess,
  studentController.getStudentById
);
router.post("/", checkAuth, studentController.createStudent);
router.put(
  "/:id",
  checkAuth,
  checkFacultyAccess,
  studentController.updateStudent
);
router.delete(
  "/:id",
  checkAuth,
  checkFacultyAccess,
  studentController.deleteStudent
);

module.exports = router;
