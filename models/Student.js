const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    regNumber: { type: String, unique: true, require: true },
    name: String,
    email: { type: String, unique: true },
    mobileNo: String,
    complaints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' }],
});

module.exports = mongoose.model('Student', studentSchema);



