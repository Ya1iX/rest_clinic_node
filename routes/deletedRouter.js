const Router = require('express');
const router = new Router();
const patientController = require('../controllers/PatientCardController');
const diagnosisController = require('../controllers/DiagnosisController');
const visitController = require('../controllers/VisitController');
const userController = require('../controllers/UserController');

// USERS
router.get('/users', userController.getAllDeleted);
router.get('/users/:id', userController.getDeletedById);
router.put('/users/:id/restore', userController.restore);

// PATIENTS
router.get('/patients', patientController.getAllDeleted);
router.get('/patients/:id', patientController.getDeletedById);
router.put('/patients/:id/restore', patientController.restore);

// VISITS
router.get('/visits', visitController.getAllDeleted);
router.get('/visits/:id', visitController.getDeletedById);
router.put('/visits/:id/restore', visitController.restore);

// DIAGNOSES
router.get('/diagnoses', diagnosisController.getAllDeleted);
router.get('/diagnoses/:id', diagnosisController.getDeletedById);
router.put('/diagnoses/:id/restore', diagnosisController.restore);

module.exports = router;