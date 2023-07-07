const sequelize = require('../db');
const {DataTypes} = require('sequelize');
const Visit = require("./Visit");
const Diagnosis = require("./Diagnosis");

const PatientCard = sequelize.define('patient_card', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
            len: [2, 32]
        }
    },
    last_name: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
            len: [2, 32]
        }
    },
    middle_name: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
            len: [2, 32]
        }
    },
    phone_number: {
        type: DataTypes.STRING(9),
        allowNull: false,
        unique: true,
        validate: {
            is: /\d{9}/g
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    passport_series: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            is: /^[A-Z]{2}\d{7}/g
        }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    job: {
        type: DataTypes.STRING
    },
    birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            isBefore: new Date()
        }
    },
    height: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        validate: {
            min: 50,
            max: 300
        }
    },
    weight: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        validate: {
            min: 20,
            max: 1000
        }
    },
    is_archived: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

PatientCard.hasMany(Visit, {
    as: 'Visits',
    foreignKey: 'patient_card_id',
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT'
});
Visit.belongsTo(PatientCard, { as: 'PatientCard', foreignKey: 'patient_card_id' })

PatientCard.hasMany(Diagnosis, {
    as: 'Diagnoses',
    foreignKey: 'patient_card_id',
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT'
});
Diagnosis.belongsTo(PatientCard, { as: 'PatientCard', foreignKey: 'patient_card_id' })

module.exports = PatientCard;