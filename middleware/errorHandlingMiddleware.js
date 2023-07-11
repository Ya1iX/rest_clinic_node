const ApiError = require('../replies/ApiError');
const {ValidationError, DatabaseError} = require("sequelize");

module.exports = function (error, req, res, next) {
    console.log(error);
    if (error instanceof ApiError) {
        return res.status(error.status).json({
            timestamp: new Date(),
            status: error.status,
            message: error.message
        });
    }
    if (error instanceof ValidationError) {
        return res.status(400).json({
            timestamp: new Date(),
            status: 400,
            message: error.message
        });
    }
    if (error instanceof DatabaseError) {
        let status = 500;

        if (error.parent.code === '22P02') {
            status = 400
        }

        return res.status(status).json({
            timestamp: new Date(),
            status: status,
            message: error.message
        });
    }
    return res.status(500).json({
        timestamp: new Date(),
        status: 500,
        message: error.message
    });
}