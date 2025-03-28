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

// backend/routes/interviewRoutes.js
const express = require("express");
const router = express.Router();
const interviewController = require("../controllers/interviewController");
const {
  checkAuth,
  checkFacultyAccess,
} = require("../middleware/authMiddleware");

router.get("/", checkAuth, interviewController.getAllInterviews);
router.get("/export", checkAuth, interviewController.exportInterviewsToExcel);
router.get("/:id", checkAuth, interviewController.getInterviewById);
router.get(
  "/student/:studentId",
  checkAuth,
  checkFacultyAccess,
  interviewController.getInterviewByStudentId
);
router.post("/", checkAuth, interviewController.createInterview);
router.put("/:id", checkAuth, interviewController.updateInterviewAnswers);
router.delete("/:id", checkAuth, interviewController.deleteInterview);

module.exports = router;

// backend/routes/questionRoutes.js
const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const { checkAuth } = require("../middleware/authMiddleware");

router.get("/", checkAuth, questionController.getAllQuestions);
router.get("/:id", checkAuth, questionController.getQuestionById);
router.post("/", checkAuth, questionController.createQuestion);
router.put("/:id", checkAuth, questionController.updateQuestion);
router.delete("/:id", checkAuth, questionController.deleteQuestion);

module.exports = router;

// backend/routes/interviewerRoutes.js
const express = require("express");
const router = express.Router();
const interviewerController = require("../controllers/interviewerController");
const { checkAuth } = require("../middleware/authMiddleware");

router.get("/", interviewerController.getAllInterviewers); // ไม่ต้องใส่ checkAuth เพราะใช้ในการล็อกอิน
router.get("/:id", interviewerController.getInterviewerById); // ไม่ต้องใส่ checkAuth เพราะใช้ในการล็อกอิน
router.post("/", checkAuth, interviewerController.createInterviewer);
router.put("/:id", checkAuth, interviewerController.updateInterviewer);
router.delete("/:id", checkAuth, interviewerController.deleteInterviewer);

module.exports = router;
