require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const User = require('./models/User');
const PatientCard = require('./models/PatientCard');
const Visit = require('./models/Visit');
const Diagnosis = require('./models/Diagnosis');

const PORT = process.env.PORT || 8080;

const app = express();

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start();