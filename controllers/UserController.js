const ApiError = require("../replies/ApiError");
const Response = require('../replies/CustomResponse');
const UserService = require('../services/UserService');

class UserController {
    async getAll(req, res, next) {
        try {
            const {specialty, page, size} = req.query;
            const users = await UserService.getAll(specialty, page, size);
            return res.status(200).json(Response.ok(users))
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async getAllDeleted(req, res, next) {
        try {
            const {specialty, page, size} = req.query;
            const users = await UserService.getAll(specialty, page, size, ['defaultScope', 'deleted']);
            return res.status(200).json(Response.ok(users))
        } catch (e) {
            next(ApiError.internal(e.message));
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

    async check(req, res, next) {
        try {

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

    async login(req, res, next) {
        try {

        } catch (e) {
            next(e);
        }
    }

    async register(req, res, next) {
        try {

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