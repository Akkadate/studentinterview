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
