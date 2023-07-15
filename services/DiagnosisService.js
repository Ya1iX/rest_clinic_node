const Diagnosis = require("../models/Diagnosis");
const {Op, literal} = require("sequelize");
const User = require("../models/User");
const PatientCard = require("../models/PatientCard");
const ApiError = require("../replies/ApiError");
const PatientCardService = require('../services/PatientCardService');
const UserService = require('../services/UserService');
const FilesParser = require("../parsers/FilesParser");

class DiagnosisService {
    async getAll(patient_card_id, user_id, diagnosis, page, size, scope) {

        page = page || 1;
        size = size || process.env.DEFAULT_PAGE_SIZE;
        scope = scope || ['defaultScope', 'notArchived'];

        let offset = page * size - size;

        return await Diagnosis.scope(scope).findAndCountAll({
            where: {
                [Op.and]: [
                    literal(patient_card_id ? `diagnosis.patient_card_id::varchar ILIKE '%${patient_card_id}%'` : ''),
                    literal(user_id ? `diagnosis.user_id::varchar ILIKE '%${user_id}%'` : '')
                ],
                diagnosis: {
                    [Op.iLike]: diagnosis ? `%${diagnosis}%` : '%%'
                }
            },
            limit: size,
            offset: offset
        });
    }

    async getById(id, scope) {
        if (!id) {
            throw ApiError.badRequest('Patient ID is not specified');
        }

        scope = scope || ['detailed', 'notArchived'];

        const visit = await Diagnosis.scope(scope).findAll({
            where: {
                id: id
            },
            include: [
                {model: User.scope(['defaultScope', 'paranoidFalse']), as: 'doctor'},
                {model: PatientCard.scope(['defaultScope', 'paranoidFalse']), as: 'patient_card'}
            ]
        });
        if (!visit) {
            throw ApiError.notFound('Diagnosis not found');
        }
        return visit;
    }

    async create(diagnosis, files) {

        await PatientCardService.getById(diagnosis.patient_card_id);
        await UserService.getById(diagnosis.user_id);

        let fileNames = [];
        if (files) {
            fileNames = FilesParser.parseArrayAny(files.files, 'diagnoses');
        }

        return await Diagnosis.create({
            ...diagnosis,
            files: fileNames,
            archived_at: undefined,
            deleted_at: undefined,
            created_at: undefined,
            changed_at: undefined
        });
    }

    async edit(id, diagnosis, files) {
        await this.getById(id);

        if (diagnosis.patient_card_id) {
            await PatientCardService.getById(diagnosis.patient_card_id);
        }
        if (diagnosis.user_id) {
            await UserService.getById(diagnosis.user_id);
        }

        let fileNames;
        if (files) {
            fileNames = FilesParser.parseArrayAny(files.files, 'diagnoses');
        }

        await Diagnosis.update({
            ...diagnosis,
            files: fileNames,
            archived_at: undefined,
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
        await this.getById(id, ['full', 'deleted']);

        await Diagnosis.restore({
            where: {
                id: id
            }
        });

        return await this.getById(id, 'full');
    }

    async delete(id) {
        await this.getById(id, 'full');

        await Diagnosis.destroy({
            where: {
                id: id
            }
        });

        return await this.getById(id, ['full', 'deleted']);
    }
}

module.exports = new DiagnosisService();