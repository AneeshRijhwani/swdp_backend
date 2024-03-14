// models/Faculty.js
const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
    empId: {
        type: String,
        unique: true,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    post: {
        type: String,
        require: true
    },
    gender: {
        type: String,
        require: true
    },
});

module.exports = mongoose.model('Faculty', facultySchema);
