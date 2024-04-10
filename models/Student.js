const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    regNumber: { type: String, unique: true, required: true },
    gender: { type: String },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    mobileNo: { type: String, required: true },
    complaints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' }],
});

module.exports = mongoose.model('Student', studentSchema);



