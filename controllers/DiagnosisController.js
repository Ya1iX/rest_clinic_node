const ApiError = require("../replies/ApiError");
const Response = require('../replies/CustomResponse');
const DiagnosisService = require("../services/DiagnosisService");

class DiagnosisController {
    async getAll(req, res, next) {
        try {
            const {patient, user, diagnosis, page, size} = req.query;
            const visits = await DiagnosisService.getAll(patient, user, diagnosis, page, size);
            return res.status(200).json(Response.ok(visits));
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async getAllArchived(req, res, next) {
        try {
            const {patient, user, diagnosis, page, size} = req.query;
            const visits = await DiagnosisService.getAll(patient, user, diagnosis, page, size, ['defaultScope', 'archived']);
            return res.status(200).json(Response.ok(visits));
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async getAllDeleted(req, res, next) {
        try {
            const {patient, user, diagnosis, page, size} = req.query;
            const visits = await DiagnosisService.getAll(patient, user, diagnosis, page, size, ['defaultScope', 'deleted']);
            return res.status(200).json(Response.ok(visits));
        } catch (e) {
            next(ApiError.internal(e.message));
        }
    }

    async getById(req, res, next) {
        try {
            const visit = await DiagnosisService.getById(req.params.id);
            return res.status(200).json(Response.ok(visit));
        } catch (e) {
            next(e);
        }
    }

    async getArchivedById(req, res, next) {
        try {
            const visit = await DiagnosisService.getById(req.params.id, ['detailed', 'archived']);
            return res.status(200).json(Response.ok(visit));
        } catch (e) {
            next(e);
        }
    }

    async getDeletedById(req, res, next) {
        try {
            const visit = await DiagnosisService.getById(req.params.id, ['detailed', 'deleted']);
            return res.status(200).json(Response.ok(visit));
        } catch (e) {
            next(e);
        }
    }

    async create(req, res, next) {
        try {
            const visit = await DiagnosisService.create(req.body, req.files);
            return res.status(201).json(Response.created(visit));
        } catch (e) {
            next(e);
        }
    }

    async edit(req, res, next) {
        try {
            const visit = await DiagnosisService.edit(req.params.id, req.body, req.files);
            return res.status(200).json(Response.ok(visit));
        } catch (e) {
            next(e);
        }
    }

    async restore(req, res, next) {
        try {
            const visit = await DiagnosisService.restore(req.params.id);
            return res.status(200).json(Response.ok(visit));
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const visit = await DiagnosisService.delete(req.params.id);
            return res.status(200).json(Response.ok(visit));
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new DiagnosisController();