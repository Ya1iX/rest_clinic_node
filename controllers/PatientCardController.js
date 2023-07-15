const Response = require('../replies/CustomResponse');
const PatientService = require('../services/PatientCardService');

class PatientCardController {
    async getAll(req, res, next) {
        try {
            const {last_name, page, size} = req.query;
            const patients = await PatientService.getAll(last_name, page, size);
            return res.status(200).json(Response.ok(patients));
        } catch (e) {
            next(e);
        }
    }

    async getAllArchived(req, res, next) {
        try {
            const {last_name, page, size} = req.query;
            const patients = await PatientService.getAll(last_name, page, size, ['defaultScope', 'archived']);
            return res.status(200).json(Response.ok(patients));
        } catch (e) {
            next(e);
        }
    }

    async getAllDeleted(req, res, next) {
        try {
            const {last_name, page, size} = req.query;
            const patients = await PatientService.getAll(last_name, page, size, ['defaultScope', 'deleted']);
            return res.status(200).json(Response.ok(patients));
        } catch (e) {
            next(e);
        }
    }

    async getById(req, res, next) {
        try {
            const patientCard = await PatientService.getById(req.params.id)
            return res.status(200).json(Response.ok(patientCard));
        } catch (e) {
            next(e);
        }
    }

    async getArchivedById(req, res, next) {
        try {
            const patientCard = await PatientService.getById(req.params.id, ['detailed', 'archived']);
            return res.status(200).json(Response.ok(patientCard));
        } catch (e) {
            next(e);
        }
    }

    async getDeletedById(req, res, next) {
        try {
            const patientCard = await PatientService.getById(req.params.id, ['detailed', 'deleted']);
            return res.status(200).json(Response.ok(patientCard));
        } catch (e) {
            next(e);
        }
    }

    async create(req, res, next) {
        try {
            const patientCard = await PatientService.create(req.body);
            return res.status(201).json(Response.created(patientCard));
        } catch (e) {
            next(e);
        }
    }

    async edit(req, res, next) {
        try {
            const patientCard = await PatientService.edit(req.params.id, req.body);
            return res.status(200).json(Response.ok(patientCard));
        } catch (e) {
            next(e);
        }
    }

    async restore(req, res, next) {
        try {
            const patientCard = await PatientService.restore(req.params.id);
            return res.status(200).json(Response.ok(patientCard));
        } catch (e) {
            next(e);
        }
    }

    async archive(req, res, next) {
        try {
            const patientCard = await PatientService.setArchived(req.params.id, new Date())
            return res.status(200).json(Response.ok(patientCard));
        } catch (e) {
            next(e);
        }
    }

    async expose(req, res, next) {
        try {
            const patientCard = await PatientService.setArchived(req.params.id, null);
            return res.status(200).json(Response.ok(patientCard));
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const patientCard = await PatientService.delete(req.params.id);
            return res.status(200).json(Response.ok(patientCard));
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new PatientCardController();