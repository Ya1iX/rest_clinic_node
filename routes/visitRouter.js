const Router = require('express');
const router = new Router();
const visitController = require('../controllers/VisitController');

// GET
router.get('/', visitController.getAll);
router.get('/:id', visitController.getById);

// POST
router.post('/', visitController.create);

// PUT
router.put('/:id', visitController.edit);

// DELETE
router.delete('/:id', visitController.delete);

module.exports = router;