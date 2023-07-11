const sequelize = require('../db');
const {DataTypes} = require('sequelize');
const ModelScopes = require("../enums/modelScopes");

const Visit = sequelize.define('visit', {
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
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    files: {
        type: DataTypes.ARRAY(DataTypes.STRING)
    },
    is_completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    archived_at: {
        type: DataTypes.DATE,
        defaultValue: null
    }
}, {
    defaultScope: {
        attributes: {
            exclude: ['files', 'description', 'archived_at', 'deleted_at', 'created_at', 'updated_at']
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

module.exports = Visit;