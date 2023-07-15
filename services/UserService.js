const User = require("../models/User");
const {Op, literal} = require("sequelize");
const bcrypt = require('bcrypt');
const ApiError = require("../replies/ApiError");
const FilesParser = require("../parsers/FilesParser");
const JwtService = require('./JwtService');

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

    async create(user, files) {
        if (!user.password) {
            throw ApiError.badRequest('Password cannot be empty')
        }
        const bcryptPassword = await bcrypt.hash(user.password, 3);

        let fileName;
        if (files) {
            fileName = FilesParser.parsePhoto(files.avatar, 'avatars');
        }

        return await User.create({
            ...user,
            password: bcryptPassword,
            avatar: fileName,
            deleted_at: undefined,
            created_at: undefined,
            changed_at: undefined
        });
    }

    async refresh(token) {
        if (!token) {
            throw ApiError.unauthorized();
        }

        const tokenData = JwtService.validateRefreshToken(token);
        const tokenDB = await JwtService.findToken(token);
        if (!tokenData || !tokenDB) {
            throw ApiError.unauthorized()
        }

        const user = await this.getById(tokenData.id);
        return await JwtService.generateAndSaveToken({id: user.id, email: user.email});
    }

    async login(email, password) {
        if (!email || !password) {
            throw ApiError.badRequest('Please enter email and password');
        }

        const user = await User.scope(['full', 'password']).findOne({
            where: {
                email: email
            }
        });
        if (!user) {
            throw ApiError.badRequest('User with this email not found');
        }

        const isPassMatches = await bcrypt.compare(password, user.password);
        if (!isPassMatches) {
            throw ApiError.badRequest('Invalid password');
        }

        const tokens = await JwtService.generateAndSaveToken({id: user.id, email: user.email});
        return {
            ...tokens,
            user: user
        };
    }

    async logout(token) {
        if (!token) {
            throw ApiError.badRequest('You are already logged out');
        }
        return await JwtService.removeToken(token);
    }

    async register(user, files) {
        const userDB = await User.findOne({
            where: {
                [Op.match]: literal(`"user".roles::varchar ILIKE '%ADMIN%'`)
            },
            paranoid: false
        });

        if (userDB) {
            throw ApiError.notFound('Cannot POST /api/v1/auth/register')
        }

        const createdUser = await this.create({...user, roles: ['USER', 'ADMIN']}, files);
        const tokens = await JwtService.generateAndSaveToken({id: createdUser.id, email: createdUser.email});

        return {
            ...tokens,
            user: createdUser
        };
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