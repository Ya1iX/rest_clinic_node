const Router = require('express');
const router = new Router();
const userController = require('../controllers/UserController')

// GET
router.get('/', userController.getAll);
router.get('/:id', userController.getById);

// POST
router.post('/', userController.create);

// PUT
router.put('/:id', userController.edit);

// DELETE
router.delete('/:id', userController.delete);

module.exports = router;