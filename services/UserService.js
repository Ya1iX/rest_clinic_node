const User = require("../models/User");
const {Op} = require("sequelize");
const ApiError = require("../replies/ApiError");
const FilesParser = require("../parsers/FilesParser");

class UserService {
    async getAll(specialty, page, size, scope) {

        page = page || 1;
        size = size || process.env.DEFAULT_PAGE_SIZE;
        scope = scope || 'defaultScope';

        let offset = page * size - size;

        return await User.scope(scope).findAndCountAll({
            where: {
                specialty: {[Op.iLike]: specialty ? `%${specialty}%` : '%%'}
            },
            limit: size,
            offset: offset
        });
    }

    async getById(id, scope) {
        if (!id) {
            throw ApiError.badRequest('ID is not specified');
        }

        scope = scope || 'detailed';

        const user = await User.scope(scope).findOne({
            where: {
                id: id
            }
        });
        if (!user) {
            throw ApiError.notFound('User not found');
        }
        return user;
    }

    async check(req, res) {

    }

    async create(user, files) {
        let fileName;
        if (files) {
            fileName = FilesParser.parsePhoto(files.avatar, 'avatars');
        }

        return await User.scope('full').create({
            ...user,
            avatar: fileName,
            deleted_at: undefined,
            created_at: undefined,
            changed_at: undefined
        });
    }

    async login(req, res) {

    }

    async register(req, res) {

    }

    async edit(id, user, files) {
        await this.getById(id);

        let fileName;
        if (files) {
            fileName = FilesParser.parsePhoto(files.avatar, 'avatars');
        }

        await User.update({
            ...user,
            avatar: fileName,
            deleted_at: undefined,
            created_at: undefined,
            changed_at: undefined
        }, {
            where: {
                id: id
            },
        });

        return await this.getById(id);
    }

    async restore(id) {
        await this.getById(id, ['defaultScope', 'deleted'])

        await User.restore({
            where: {
                id: id
            }
        });

        return await this.getById(id);
    }

    async delete(id) {
        await this.getById(id);

        await User.destroy({
            where: {
                id: id
            }
        });

        return await this.getById(id, ['full', 'deleted']);
    }
}

module.exports = new UserService();