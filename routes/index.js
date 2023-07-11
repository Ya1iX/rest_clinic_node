const Router = require('express');
const router = new Router();

const userRouter = require('./userRouter');
const patientCardRouter = require('./patientCardRouter');
const visitsRouter = require('./visitRouter');
const diagnosisRouter = require('./diagnosisRouter');
const archiveRouter = require('./archiveRouter');
const deletedRouter = require('./deletedRouter');
const authRouter = require('./authRouter');

router.use('/users', userRouter);
router.use('/patients', patientCardRouter);
router.use('/visits', visitsRouter);
router.use('/diagnoses', diagnosisRouter);
router.use('/archive', archiveRouter);
router.use('/deleted', deletedRouter);
router.use('/auth', authRouter);

module.exports = router;