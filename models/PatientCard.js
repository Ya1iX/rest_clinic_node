const sequelize = require('../db');
const {DataTypes} = require('sequelize');
const Visit = require("./Visit");
const Diagnosis = require("./Diagnosis");
const ModelScopes = require("../enums/modelScopes");

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
            len: {
                args: [2, 32],
                msg: 'First name length must be between 2 and 32 symbols'
            }
        }
    },
    last_name: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
            len: {
                args: [2, 32],
                msg: 'Last name length must be between 2 and 32 symbols'
            }
        }
    },
    middle_name: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
            len: {
                args: [2, 32],
                msg: 'Middle name length must be between 2 and 32 symbols'
            }
        }
    },
    phone_number: {
        type: DataTypes.STRING(9),
        allowNull: false,
        unique: true,
        validate: {
            is: {
                args: /^\d{9}/gm,
                msg: 'Phone number must contain 9 digits'
            }
        }
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: {
                args: true,
                msg: 'Invalid email format'
            }
        }
    },
    passport_series: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            is: {
                args: /^[A-Z]{2}\d{7}/gm,
                msg: 'Invalid passport series format. Example: BM1234567'
            }
        }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Address cannot be empty'
            }
        }
    },
    job: {
        type: DataTypes.STRING
    },
    birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            function(value) {
                const date = Date.parse(value);
                if (date > Date.now()) {
                    throw new Error('It is impossible to specify a birthdate later than the current moment')
                }
            }
        }
    },
    height: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        validate: {
            min: {
                args: 50,
                msg: 'Minimal height is 50cm'
            },
            max: {
                args: 300,
                msg: 'Maximum height is 300cm'
            }
        }
    },
    weight: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        validate: {
            min: {
                args: 20,
                msg: 'Minimal weight is 20kg'
            },
            max: {
                args: 1000,
                msg: 'Maximum weight is 1000kg'
            }
        }
    },
    archived_at: {
        type: DataTypes.DATE,
        defaultValue: null
    }
}, {
    defaultScope: {
        attributes: {
            exclude: ['passport_series', 'job', 'height', 'weight', 'archived_at', 'deleted_at', 'created_at', 'updated_at']
        },
        order: [['last_name', 'ASC']]
    },
    scopes: {
        deleted: ModelScopes.deleted,
        paranoidFalse: ModelScopes.paranoidFalse,
        archived: ModelScopes.archived,
        notArchived: ModelScopes.notArchived,
        detailed: {
            attributes: {
                exclude: ['archived_at', 'deleted_at', 'created_at', 'updated_at'],
            },
            include: [{model: Visit, as: 'visits'}, {model: Diagnosis, as: 'diagnoses'}]
        },
        full: {
            include: [{model: Visit, as: 'visits'}, {model: Diagnosis, as: 'diagnoses'}]
        }
    },
    paranoid: true,
    timestamps: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

PatientCard.hasMany(Visit, {
    as: 'visits',
    foreignKey: 'patient_card_id',
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT'
});
Visit.belongsTo(PatientCard, { as: 'patient_card', foreignKey: 'patient_card_id' })

PatientCard.hasMany(Diagnosis, {
    as: 'diagnoses',
    foreignKey: 'patient_card_id',
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT'
});
Diagnosis.belongsTo(PatientCard, { as: 'patient_card', foreignKey: 'patient_card_id' })

module.exports = PatientCard;