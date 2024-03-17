const Student = require('../models/Student');
const Complaint = require('../models/Complaint');

async function createComplaint(req, res) {
    const {
        title,
        description,
        registrationNumber,
        studentName,
        studentMobileNo,
        email,
        facultyName,
        dateTime,
    } = req.body;
    try {

        let student = await Student.findOne({ regNumber: registrationNumber.toUpperCase() });
        
        if (!student) {
            student = new Student({
                regNumber: registrationNumber.toUpperCase(),
                name: studentName.toUpperCase(),
                mobileNo: studentMobileNo,
                email
            });
            await student.save();
        }
        const complaint = new Complaint({
            title : title.toUpperCase(),
            description,
            registrationNumber : registrationNumber.toUpperCase(),
            studentName,
            studentMobileNo,
            facultyName,
            dateTime: dateTime, 
            email
        });
        await complaint.save();
        
        student.complaints.push(complaint);
        await student.save();

        res.status(201).json({ message: 'Complaint created successfully', complaint });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}



async function addStudent(req, res) {
    const { regNumber, name, mobileNo, email } = req.body;

    try {
        const existingStudent = await Student.findOne({ $or: [{ regNumber: regNumber.toUpperCase() }, { email }] });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student with provided registration number or email already exists' });
        }

        const student = new Student({
            regNumber: regNumber.toUpperCase(),
            name: name.toUpperCase(),
            mobileNo,
            email
        });

        await student.save();

        res.status(201).json({ message: 'Student added successfully', student });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function modifyComplaint(req, res) {
    const { complaintId } = req.params;
    const { title, description, category } = req.body;

    try {
        const complaint = await Complaint.findByIdAndUpdate(
            complaintId,
            { title, description, category },
            { new: true }
        );

        res.status(200).json({ message: 'Complaint modified successfully', complaint });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function searchComplaintsByRegNumber(req, res) {
    const { regNumber } = req.body;

    try {
        const student = await Student.findOne({ regNumber:regNumber.toUpperCase() }).populate('complaints');

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ complaints: student.complaints.reverse() });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
async function getAllComplaints(req, res) {
    try {
        const complaints = await Complaint.find();
        if (!complaints || complaints.length === 0) {
            return res.status(404).json({ message: 'No Complaint found' });
        }
        res.status(200).json({ complaints:complaints.reverse() });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}


async function getStudentByRegNumber(req, res) {
    const { regNumber } = req.body;

    try {
        const student = await Student.findOne({ regNumber: regNumber.toUpperCase() });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ student });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createComplaint,
    addStudent,
    modifyComplaint,
    searchComplaintsByRegNumber,
    getStudentByRegNumber,
    getAllComplaints
};
