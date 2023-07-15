const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const JwtToken = sequelize.define('jwt_token', {
    user_id: {
        type: DataTypes.UUID,
        unique: true,
        primaryKey: true
    },
    refresh_token: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = JwtToken;