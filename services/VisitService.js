const FilesParser = require("../parsers/FilesParser");
const ApiError = require("../replies/ApiError");
const Visit = require("../models/Visit");
const {Op, literal} = require("sequelize");
const User = require("../models/User");
const PatientCard = require("../models/PatientCard");
const PatientCardService = require("./PatientCardService");
const UserService = require("./UserService");

class VisitService {
    async getAll(patient_card_id, user_id, page, size, scope) {

        page = page || 1;
        size = size || process.env.DEFAULT_PAGE_SIZE;
        scope = scope || ['defaultScope', 'notArchived'];

        let offset = page * size - size;

        return await Visit.scope(scope).findAndCountAll({
            where: {
                [Op.and]: [
                    literal(patient_card_id ? `visit.patient_card_id::varchar ILIKE '%${patient_card_id}%'` : ''),
                    literal(user_id ? `visit.user_id::varchar ILIKE '%${user_id}%'` : '')
                ]
            },
            limit: size,
            offset: offset
        });
    }

    async getById(id, scope) {
        if (!id) {
            throw ApiError.badRequest('ID is not specified');
        }

        scope = scope || ['detailed', 'notArchived'];

        const visit = await Visit.scope(scope).findOne({
            where: {
                id: id
            },
            include: [
                {model: User.scope(['defaultScope', 'paranoidFalse']), as: 'doctor'},
                {model: PatientCard.scope(['defaultScope', 'paranoidFalse']), as: 'patient_card'}
            ]
        });
        if (!visit) {
            throw ApiError.notFound('Visit not found');
        }
        return visit;
    }

    async create(visit, files) {

        await PatientCardService.getById(visit.patient_card_id);
        await UserService.getById(visit.user_id);

        let fileNames = [];
        if (files) {
            fileNames = FilesParser.parseArrayAny(files.files, 'visits');
        }

        return await Visit.create({
            ...visit,
            files: fileNames,
            archived_at: undefined,
            deleted_at: undefined,
            created_at: undefined,
            changed_at: undefined
        });
    }

    async edit(id, visit, files) {
        await this.getById(id);

        if (visit.patient_card_id) {
            await PatientCardService.getById(visit.patient_card_id);
        }
        if (visit.user_id) {
            await UserService.getById(visit.user_id);
        }

        let fileNames;
        if (files) {
            fileNames = FilesParser.parseArrayAny(files.files, 'visits');
        }

        await Visit.update({
            ...visit,
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

        await Visit.restore({
            where: {
                id: id
            }
        });

        return await this.getById(id, 'full');
    }

    async delete(id) {
        await this.getById(id, 'full');

        await Visit.scope('full').destroy({
            where: {
                id: id
            }
        });

        return await this.getById(id, ['full', 'deleted']);
    }
}

module.exports = new VisitService();