const express = require('express');
const facultyController = require('../controllers/facultyController');

const router = express.Router();

router.post('/complaint/create', facultyController.createComplaint);
router.post('/students/add', facultyController.addStudent);
router.put('/complaints/:complaintId', facultyController.modifyComplaint);
router.post('/complaints/student', facultyController.searchComplaintsByRegNumber);
router.get('/complaints', facultyController.getAllComplaints)
router.post('/student', facultyController.getStudentByRegNumber);

module.exports = router;