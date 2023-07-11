const {Op} = require("sequelize");
const ModelScopes = {
    deleted: {
        attributes: {
            include: ['deleted_at']
        },
        where: {
            deleted_at: {
                [Op.not]: null
            }
        },
        paranoid: false
    },
    paranoidFalse: {
        paranoid: false
    },
    archived: {
        attributes: {
            include: ['archived_at']
        },
        where: {
            archived_at: {
                [Op.not]: null
            }
        }
    },
    notArchived: {
        where: {
            archived_at: null
        }
    }
}

module.exports = ModelScopes;