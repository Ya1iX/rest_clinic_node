const sequelize = require('../db');
const {DataTypes} = require('sequelize');
const {userRoles} = require("../enums/userRoles");
const {userSpecialties} = require("../enums/userSpecialties");
const Visit = require("./Visit");
const Diagnosis = require("./Diagnosis");

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
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    roles: {
        type: DataTypes.ARRAY(DataTypes.ENUM(userRoles)),
        allowNull: false,
        defaultValue: ['USER'],
        // validate: {
        //     isArrayValid(value) {
        //         const values = (Array.isArray(value) ? value : [value]);
        //         values.forEach((role) => {
        //             if (!userRoles.includes(role)) {
        //                 throw new Error(`Role ${role} doesn't exists`);
        //             }
        //         });
        //     }
        // }
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
    specialty: {
        type: DataTypes.ENUM(userSpecialties),
        allowNull: false
    },
    avatar_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true
        }
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

User.hasMany(Visit, {
    as: 'Visits',
    foreignKey: 'user_id',
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT'
});
Visit.belongsTo(User, { as: 'User', foreignKey: 'user_id' })

User.hasMany(Diagnosis, {
    as: 'Diagnoses',
    foreignKey: 'user_id',
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT'
});
Diagnosis.belongsTo(User, { as: 'User', foreignKey: 'user_id' })

module.exports = User;