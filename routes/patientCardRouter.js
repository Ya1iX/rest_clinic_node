const Router = require('express');
const router = new Router();
const patientController = require('../controllers/PatientCardController');

// GET
router.get('/', patientController.getAll);
router.get('/:id', patientController.getById);

// POST
router.post('/', patientController.create);

// PUT
router.put('/:id', patientController.edit);
router.put('/:id/archive', patientController.archive);

// DELETE
router.delete('/:id', patientController.delete);

module.exports = router;