const sequelize = require('../db');
const {DataTypes} = require('sequelize');
const userRoles = require("../enums/userRoles");
const userSpecialties = require("../enums/userSpecialties");
const Visit = require("./Visit");
const Diagnosis = require("./Diagnosis");
const ModelScopes = require("../enums/modelScopes");
const JwtToken = require("./JwtToken");

const User = sequelize.define('user', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: {
                args: true,
                msg: 'Invalid email format'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    roles: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: ['USER'],
        validate: {
            isArrayValid(value) {
                const values = Array.isArray(value) ? value : [value];
                values.forEach((role) => {
                    if (!userRoles.includes(role)) {
                        throw new Error(`Role ${role} doesn't exists`);
                    }
                });
            }
        }
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
    specialty: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [userSpecialties],
                msg: `Invalid specialty. Valid specialties: ${userSpecialties}`
            }
        }
    },
    avatar: {
        type: DataTypes.STRING,
        defaultValue: process.env.DEFAULT_AVATAR_NAME,
        allowNull: false
    }
}, {
    defaultScope: {
        attributes: {
            exclude: ['email', 'password', 'roles', 'phone_number', 'deleted_at', 'created_at', 'updated_at']
        },
        order: [['specialty', 'ASC']]
    },
    scopes: {
        deleted: ModelScopes.deleted,
        paranoidFalse: ModelScopes.paranoidFalse,
        detailed: {
            attributes: {
                exclude: ['password', 'roles', 'deleted_at', 'created_at', 'updated_at']
            }
        },
        full: {
            attributes: {
                exclude: ['password']
            },
            include: [{model: Visit, as: 'visits'}, {model: Diagnosis, as: 'diagnoses'}]
        },
        password: {
            attributes: {
                include: ['password']
            }
        }
    },
    paranoid: true,
    timestamps: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

User.hasMany(Visit, {
    as: 'visits',
    foreignKey: 'user_id',
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT'
});
Visit.belongsTo(User, { as: 'doctor', foreignKey: 'user_id' });

User.hasMany(Diagnosis, {
    as: 'diagnoses',
    foreignKey: 'user_id',
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT'
});
Diagnosis.belongsTo(User, { as: 'doctor', foreignKey: 'user_id' });

JwtToken.belongsTo(User, {as: 'user', foreignKey: 'user_id'});

module.exports = User;