const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    regNumber: { type: String, unique: true, require: true },
    gender: { type: String },
    name: { type: String, require: true },
    email: { type: String, unique: true, require: true },
    mobileNo: { type: String, unique: true, require: true },
    complaints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' }],
});

module.exports = mongoose.model('Student', studentSchema);



