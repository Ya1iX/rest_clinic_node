const Router = require('express');
const router = new Router();
const diagnosisController = require('../controllers/DiagnosisController');

// GET
router.get('/', diagnosisController.getAll);
router.get('/:id', diagnosisController.getById);

// POST
router.post('/', diagnosisController.create);

// PUT
router.put('/:id', diagnosisController.edit);

// DELETE
router.delete('/:id', diagnosisController.delete);

module.exports = router;