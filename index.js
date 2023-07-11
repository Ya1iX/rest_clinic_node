require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const errorHandler = require('./middleware/errorHandlingMiddleware');
const invalidRequestPathMiddleware = require('./middleware/invalidRequestPathMiddleware');
const path = require('path');

const User = require('./models/User');
const PatientCard = require('./models/PatientCard');
const Visit = require('./models/Visit');
const Diagnosis = require('./models/Diagnosis');

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/static', express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}));
app.use('/api/v1', router);

app.use(invalidRequestPathMiddleware);
app.use(errorHandler);

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