// backend/routes/studentRoutes.js
const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

router.get("/", studentController.getAllStudents);
router.get("/faculty/:faculty", studentController.getStudentsByFaculty);
router.get("/program/:program", studentController.getStudentsByProgram);
router.get("/not-interviewed", studentController.getNotInterviewedStudents);
router.get("/summary", studentController.getInterviewStatusSummary);
router.get("/:id", studentController.getStudentById);
router.post("/", studentController.createStudent);
router.put("/:id", studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);

module.exports = router;
