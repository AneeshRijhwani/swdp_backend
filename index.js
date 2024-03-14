const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use('/faculty', require('./routes/facultyRoutes'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
