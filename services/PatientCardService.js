const PatientCard = require("../models/PatientCard");
const {Op} = require("sequelize");
const ApiError = require("../replies/ApiError");
const Diagnosis = require("../models/Diagnosis");
const Visit = require("../models/Visit");

class PatientCardService {
    async getAll(last_name, page, size, scope) {

        page = page || 1;
        size = size || process.env.DEFAULT_PAGE_SIZE;
        scope = scope || ['defaultScope', 'notArchived'];

        let offset = page * size - size;

        return await PatientCard.scope(scope).findAndCountAll({
            where: {
                last_name: {[Op.iLike]: last_name ? `%${last_name}%` : '%%'}
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

        const patientCard = await PatientCard.scope(scope).findOne({
            where: {
                id: id
            }
        });
        if (!patientCard) {
            throw ApiError.notFound('Patient card not found');
        }
        return patientCard;
    }

    async create(patient) {
        return await PatientCard.scope('detailed').create({
            ...patient,
            archived_at: undefined,
            deleted_at: undefined,
            created_at: undefined,
            updated_at: undefined
        });
    }

    async edit(id, patient) {
        await this.getById(id);

        await PatientCard.update({
            ...patient,
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

        await PatientCard.restore({
            where: {
                id: id
            }
        });
        await Diagnosis.restore({
            where: {
                patient_card_id: id
            }
        });
        await Visit.restore({
            where: {
                patient_card_id: id
            }
        });

        return await this.getById(id, 'full');
    }

    async setArchived(id, value) {
        await this.getById(id, 'detailed');

        await PatientCard.update({
            archived_at: value
        }, {
            where: {
                id: id
            }
        });
        await Diagnosis.update({
            archived_at: value
        }, {
            where: {
                patient_card_id: id
            }
        });
        await Visit.update({
            archived_at: value
        }, {
            where: {
                patient_card_id: id
            }
        });

        return await this.getById(id, 'detailed');
    }

    async delete(id) {
        await this.getById(id, 'full');

        await PatientCard.destroy({
            where: {
                id: id
            }
        });
        await Diagnosis.destroy({
            where: {
                patient_card_id: id
            }
        });
        await Visit.destroy({
            where: {
                patient_card_id: id
            }
        });

        return await this.getById(id, ['full', 'deleted']);
    }
}

module.exports = new PatientCardService();