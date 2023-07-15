const Router = require('express');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const accessMiddleware = require('../middleware/accessMiddleware');

const userRouter = require('./userRouter');
const patientCardRouter = require('./patientCardRouter');
const visitsRouter = require('./visitRouter');
const diagnosisRouter = require('./diagnosisRouter');
const archiveRouter = require('./archiveRouter');
const deletedRouter = require('./deletedRouter');
const authRouter = require('./authRouter');

router.use('/users', userRouter);
router.use('/patients', authMiddleware, patientCardRouter);
router.use('/visits', authMiddleware, visitsRouter);
router.use('/diagnoses', authMiddleware, diagnosisRouter);
router.use('/archive', authMiddleware, archiveRouter);
router.use('/deleted', authMiddleware, accessMiddleware('ADMIN'), deletedRouter);
router.use('/auth', authRouter);

module.exports = router;