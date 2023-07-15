const Response = require('../replies/CustomResponse');
const VisitService = require('../services/VisitService');

class VisitController {
    async getAll(req, res, next) {
        try {
            const {patient, user, page, size} = req.query;
            const visits = await VisitService.getAll(patient, user, page, size);
            return res.status(200).json(Response.ok(visits));
        } catch (e) {
            next(e);
        }
    }

    async getAllArchived(req, res, next) {
        try {
            const {patient, user, page, size} = req.query;
            const visits = await VisitService.getAll(patient, user, page, size, ['defaultScope', 'archived']);
            return res.status(200).json(Response.ok(visits));
        } catch (e) {
            next(e);
        }
    }

    async getAllDeleted(req, res, next) {
        try {
            const {patient, user, page, size} = req.query;
            const visits = await VisitService.getAll(patient, user, page, size, ['defaultScope', 'deleted']);
            return res.status(200).json(Response.ok(visits));
        } catch (e) {
            next(e);
        }
    }

    async getById(req, res, next) {
        try {
            const visit = await VisitService.getById(req.params.id);
            return res.status(200).json(Response.ok(visit));
        } catch (e) {
            next(e);
        }
    }

    async getArchivedById(req, res, next) {
        try {
            const visit = await VisitService.getById(req.params.id, ['detailed', 'archived']);
            return res.status(200).json(Response.ok(visit));
        } catch (e) {
            next(e);
        }
    }

    async getDeletedById(req, res, next) {
        try {
            const visit = await VisitService.getById(req.params.id, ['detailed', 'deleted']);
            return res.status(200).json(Response.ok(visit));
        } catch (e) {
            next(e);
        }
    }

    async create(req, res, next) {
        try {
            const visit = await VisitService.create(req.body, req.files);
            return res.status(201).json(Response.created(visit));
        } catch (e) {
            next(e);
        }
    }

    async edit(req, res, next) {
        try {
            const visit = await VisitService.edit(req.params.id, req.body, req.files);
            return res.status(200).json(Response.ok(visit));
        } catch (e) {
            next(e);
        }
    }

    async restore(req, res, next) {
        try {
            const visit = await VisitService.restore(req.params.id);
            return res.status(200).json(Response.ok(visit));
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const visit = await VisitService.delete(req.params.id);
            return res.status(200).json(Response.ok(visit));
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new VisitController();