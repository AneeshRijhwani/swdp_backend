const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Faculty = require('../models/Faculty');
const OTP = require('../models/OTP');
require('dotenv').config();

async function signup(req, res) {
    const { empId, email, name, password, post, gender } = req.body;

    try {
        const existingFaculty = await Faculty.findOne({ $or: [{ empId }, { email }] });

        if (existingFaculty) {
            if (existingFaculty.empId === empId) {
                return res.status(400).json({ message: 'Faculty with the given ID already exists' });
            } else {
                return res.status(400).json({ message: 'Faculty with the given email already exists' });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newFaculty = new Faculty({
            empId,
            email: email,
            name: name.toUpperCase(),
            password: hashedPassword,
            post: post.toUpperCase(),
            gender: gender.toUpperCase(),
        });

        await newFaculty.save();
        res.status(201).json({ message: 'Faculty registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function login(req, res) {
    const { empId, password } = req.body;
    try {
        const faculty = await Faculty.findOne({ empId });
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        const isPasswordMatch = await bcrypt.compare(password, faculty.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ name: faculty.name, empId: faculty.empId, post: faculty.post }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function resetPassword(req, res) {
    const { empId, newPassword } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await Faculty.findOneAndUpdate({ empId }, { password: hashedPassword });

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}


async function forgotPassword(req, res) {

    const {empId} = req.body;

    try {
        const faculty = await Faculty.findOne({ empId });
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty with this employment Id does not exist' });
        }

        const email = faculty.email;
        // Generate OTP
        const otpValue = generateOTP();

        // Store OTP in OTP collection with an expiration time
        const otp = new OTP({
            email,
            otp: otpValue,
            expiresAt: new Date(Date.now() + (60000)),
        });
        await otp.save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 537,
            secure: false, 
            auth: {
                user: process.env.SMTP_User,
                pass: process.env.SMTP_Pass,
            },
        });

        const mailOptions = {
            from: 'serviceComplaints@vitbhopal.ac.in',
            to: email,
            subject: 'Password Reset OTP',
            text: `Dear User,\nYour OTP for password reset is: ${otpValue}.\n\nThank you for using the Student Welfare Discipline Portal.\n\nRegards,\nSupport - SWDPortal`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Failed to send OTP via email' });
            }
            res.status(200).json({email,
                 message: 'OTP sent to your email' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}


function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000);
}

async function verifyOTP(req, res) {
    const { email, otp } = req.body;

    try {
        const otpRecord = await OTP.findOneAndDelete({ email, otp });
        if (!otpRecord) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        
        if (otpRecord.expiresAt < Date.now()) {
            return res.status(401).json({ message: 'OTP has expired' });
        }

        res.status(200).json({ message: 'OTP verification successful' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function updatePassword(req, res) {
    const { empId, newPassword } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await Faculty.findOneAndUpdate({ empId }, { password: hashedPassword });

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    signup,
    login,
    resetPassword,
    forgotPassword,
    verifyOTP,
    updatePassword,
};
