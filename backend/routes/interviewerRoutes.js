// backend/routes/interviewerRoutes.js
const express = require("express");
const router = express.Router();
const interviewerController = require("../controllers/interviewerController");

router.get("/", interviewerController.getAllInterviewers);
router.get("/:id", interviewerController.getInterviewerById);
router.post("/", interviewerController.createInterviewer);
router.put("/:id", interviewerController.updateInterviewer);
router.delete("/:id", interviewerController.deleteInterviewer);

module.exports = router;
