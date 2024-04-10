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
        gender,
        remark,
        IdCardStatus
    } = req.body;
    try {
        let student = await Student.findOne({ regNumber: registrationNumber.toUpperCase() });

        if (!student) {
            student = new Student({
                regNumber: registrationNumber.toUpperCase(),
                name: studentName.toUpperCase(),
                mobileNo: studentMobileNo,
                email,
                gender,
            });
            await student.save();
        }

        const complaint = new Complaint({
            title: title.toUpperCase(),
            description,
            registrationNumber: registrationNumber.toUpperCase(),
            studentName,
            studentMobileNo,
            facultyName,
            dateTime,
            email,
            gender,
            remark,
            idCardStatus:IdCardStatus,
            modifiedBy: []
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
    const { regNumber, name, mobileNo, email, gender } = req.body;
    try {
        const existingStudent = await Student.findOne({ $or: [{ regNumber: regNumber.toUpperCase() }, { email }] });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student with provided registration number or email already exists' });
        }

        const student = new Student({
            regNumber: regNumber.toUpperCase(),
            name: name.toUpperCase(),
            mobileNo,
            email,
            gender,
        });

        await student.save();

        res.status(201).json({ message: 'Student added successfully', student });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function modifyComplaint(req, res) {
    const { complaintId } = req.params;
    const { title, description, modifiedBy, IdCardStatus, remark } = req.body;

    try {
        const complaint = await Complaint.findByIdAndUpdate(
            complaintId,
            {
                title,
                description,
                idCardStatus:IdCardStatus,
                remark,
                $push: { modifiedBy } 
            },
            { new: true }
        );

        res.status(200).json({ message: 'Complaint modified successfully', complaint });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }

}

async function resolveComplaint(req, res) {
    const { complaintId } = req.params;
    const { title, description, modifiedBy ,remark, IdCardStatus} = req.body;
    try {
        const complaint = await Complaint.findById(complaintId);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        if (complaint.status === 'Resolved') {
            return res.status(400).json({ message: 'Complaint is already resolved' });
        }

        const updatedComplaint = await Complaint.findByIdAndUpdate(
            complaintId,
            { 
                status: 'Resolved',
                title,
                description,
                remark,
                idCardStatus: IdCardStatus,
                $push: { modifiedBy } 
            },
            { new: true }
        );

        res.status(200).json({ message: 'Complaint resolved successfully', complaint: updatedComplaint });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}


async function searchComplaintsByRegNumber(req, res) {
    const { regNumber } = req.body;
    try {
        const student = await Student.findOne({ regNumber: regNumber.toUpperCase() }).populate('complaints');

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ complaints: student.complaints.reverse() });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
async function getComplaintByRegistrationNumber(req, res) {
    const { regNumber } = req.params;

    try {
        const student = await Student.findOne({ regNumber: regNumber.toUpperCase() }).populate('complaints');

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ complaints: student.complaints.reverse() });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
async function getAllStudents(req, res) {
    try {
        const students = await Student.find();
        if (!students || students.length === 0) {
            return res.status(404).json({ message: 'No Complaint found' });
        }
        res.status(200).json({ students: students.reverse() });
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
        res.status(200).json({ complaints: complaints.reverse() });
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
async function getStudentDetailByRegNumber(req, res) {
    const { regNumber } = req.params;
    try {
        const student = await Student.findOne({ regNumber: regNumber.toUpperCase() });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createComplaint,
    addStudent,
    getAllStudents,
    modifyComplaint,
    searchComplaintsByRegNumber,
    getStudentByRegNumber,
    getStudentDetailByRegNumber,
    getAllComplaints,
    getComplaintByRegistrationNumber,
    resolveComplaint
};
