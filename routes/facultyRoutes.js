const express = require('express');
const facultyController = require('../controllers/facultyController');

const router = express.Router();

router.post('/complaint/create', facultyController.createComplaint);
router.post('/students/add', facultyController.addStudent);
router.put('/modify/:complaintId', facultyController.modifyComplaint);
router.put('/complaints/:complaintId/resolve', facultyController.resolveComplaint);
router.post('/complaints/student', facultyController.searchComplaintsByRegNumber);
router.get('/complaints/student/:regNumber', facultyController.getComplaintByRegistrationNumber);
router.get('/complaints', facultyController.getAllComplaints)
router.post('/student', facultyController.getStudentByRegNumber);
router.get('/student/:regNumber', facultyController.getStudentDetailByRegNumber);

module.exports = router;