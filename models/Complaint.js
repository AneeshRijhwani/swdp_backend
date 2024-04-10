const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    dateTime: { type: Date },
    email: { type: String },
    registrationNumber: { type: String },
    studentName: { type: String },
    studentMobileNo: { type: String },
    facultyName: { type: String },
    status: { type: String, default: 'Pending' },
    gender: { type: String },
    remark: { type: String, required: false },
    idCardStatus: {type: String },
    modifiedBy: [{ type: String }],
});

module.exports = mongoose.model('Complaint', complaintSchema);
