const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const Diagnosis = sequelize.define('diagnosis', {
    patient_card_id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    diagnosis: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    is_actual: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    is_archived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

module.exports = Diagnosis;