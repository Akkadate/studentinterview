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
