const Router = require('express');
const router = new Router();
const patientController = require('../controllers/PatientCardController');
const diagnosisController = require('../controllers/DiagnosisController');
const visitController = require('../controllers/VisitController');

// PATIENTS
router.get('/patients', patientController.getAllArchived);
router.get('/patients/:id', patientController.getArchivedById);
router.put('/patients/:id/expose', patientController.expose);

// VISITS
router.get('/visits', visitController.getAllArchived);
router.get('/visits/:id', visitController.getArchivedById);

// DIAGNOSES
router.get('/diagnoses', diagnosisController.getAllArchived);
router.get('/diagnoses/:id', diagnosisController.getArchivedById);

module.exports = router;