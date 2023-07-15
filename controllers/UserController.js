const Response = require('../replies/CustomResponse');
const UserService = require('../services/UserService');

class UserController {
    async getAll(req, res, next) {
        try {
            const {specialty, page, size} = req.query;
            const users = await UserService.getAll(specialty, page, size);
            return res.status(200).json(Response.ok(users))
        } catch (e) {
            next(e);
        }
    }

    async getAllDeleted(req, res, next) {
        try {
            const {specialty, page, size} = req.query;
            const users = await UserService.getAll(specialty, page, size, ['defaultScope', 'deleted']);
            return res.status(200).json(Response.ok(users))
        } catch (e) {
            next(e);
        }
    }

    async getById(req, res, next) {
        try {
            const user = await UserService.getById(req.params.id);
            return res.status(200).json(Response.ok(user));
        } catch (e) {
            next(e);
        }
    }

    async getDeletedById(req, res, next) {
        try {
            const user = await UserService.getById(req.params.id, ['detailed', 'deleted']);
            return res.status(200).json(Response.ok(user));
        } catch (e) {
            next(e);
        }
    }

    async create(req, res, next) {
        try {
            const user = await UserService.create(req.body, req.files);
            return res.status(201).json(Response.created(user));
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const tokens = await UserService.refresh(req.cookies.refreshToken);
            res.cookie('refreshToken', tokens.refreshToken);
            return res.status(200).json(Response.ok(tokens));
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const user = await UserService.login(email, password);
            res.cookie('refreshToken', user.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.status(200).json(Response.ok(user));
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            await UserService.logout(req.cookies.refreshToken);
            res.clearCookie('refreshToken');
            return res.status(200).json(Response.ok());
        } catch (e) {
            next(e);
        }
    }

    async register(req, res, next) {
        try {
            const user = await UserService.register(req.body, req.files);
            res.cookie('refreshToken', user.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.status(201).json(Response.created(user));
        } catch (e) {
            next(e);
        }
    }

    async edit(req, res, next) {
        try {
            const user = await UserService.edit(req.params.id, req.body, req.files);
            return res.status(200).json(Response.ok(user));
        } catch (e) {
            next(e);
        }
    }

    async restore(req, res, next) {
        try {
            const user = await UserService.restore(req.params.id);
            return res.status(200).json(Response.ok(user));
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const user = await UserService.delete(req.params.id);
            return res.status(200).json(Response.ok(user));
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();