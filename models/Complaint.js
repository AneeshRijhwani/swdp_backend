const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    title: String,
    description: String,
    dateTime: { type: Date },
    email: { type: String},
    registrationNumber: { type: String},
    studentName: String,
    studentMobileNo: String,
    facultyName: String,
});

module.exports = mongoose.model('Complaint', complaintSchema);