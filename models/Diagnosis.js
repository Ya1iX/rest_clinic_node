const sequelize = require('../db');
const {DataTypes} = require('sequelize');
const ModelScopes = require("../enums/modelScopes");

const Diagnosis = sequelize.define('diagnosis', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        primaryKey: true
    },
    patient_card_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    diagnosis: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Diagnosis cannot be empty'
            }
        }
    },
    files: {
        type: DataTypes.ARRAY(DataTypes.STRING)
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
    archived_at: {
        type: DataTypes.DATE,
        defaultValue: null
    }
}, {
    defaultScope: {
        attributes: {
            exclude: ['files', 'archived_at', 'deleted_at', 'created_at', 'updated_at']
        },
        order: [['date', 'ASC']]
    },
    scopes: {
        deleted: ModelScopes.deleted,
        paranoidFalse: ModelScopes.paranoidFalse,
        archived: ModelScopes.archived,
        notArchived: ModelScopes.notArchived,
        detailed: {
            attributes: {
                exclude: ['archived_at', 'deleted_at', 'created_at', 'updated_at']
            }
        },
        full: {}
    },
    paranoid: true,
    timestamps: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Diagnosis;