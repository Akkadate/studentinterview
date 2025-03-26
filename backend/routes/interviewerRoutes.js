// backend/routes/interviewerRoutes.js
const express = require('express');
const router = express.Router();
const interviewerController = require('../controllers/interviewerController');

router.get('/', interviewerController.getAllInterviewers);
router.get('/:id', interviewerController.getInterviewerById);
router.post('/', interviewerController.createInterviewer);
router.put('/:id', interviewerController.updateInterviewer);
router.delete('/:id', interviewerController.deleteInterviewer);

module.exports = router;


// backend/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/', studentController.getAllStudents);
router.get('/faculty/:faculty', studentController.getStudentsByFaculty);
router.get('/program/:program', studentController.getStudentsByProgram);
router.get('/not-interviewed', studentController.getNotInterviewedStudents);
router.get('/summary', studentController.getInterviewStatusSummary);
router.get('/:id', studentController.getStudentById);
router.post('/', studentController.createStudent);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);

module.exports = router;


// backend/routes/questionRoutes.js
const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.get('/', questionController.getAllQuestions);
router.get('/:id', questionController.getQuestionById);
router.post('/', questionController.createQuestion);
router.put('/:id', questionController.updateQuestion);
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;


// backend/routes/interviewRoutes.js
const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');

router.get('/', interviewController.getAllInterviews);
router.get('/export', interviewController.exportInterviewsToExcel);
router.get('/:id', interviewController.getInterviewById);
router.get('/student/:studentId', interviewController.getInterviewByStudentId);
router.post('/', interviewController.createInterview);
router.put('/:id', interviewController.updateInterviewAnswers);
router.delete('/:id', interviewController.deleteInterview);

module.exports = router;
