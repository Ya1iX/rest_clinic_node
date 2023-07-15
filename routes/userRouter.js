const Router = require('express');
const router = new Router();
const userController = require('../controllers/UserController')
const authMiddleware = require('../middleware/authMiddleware');
const accessMiddleware = require('../middleware/accessMiddleware');

// GET
router.get('/', userController.getAll);
router.get('/:id', userController.getById);

// POST
router.post('/', authMiddleware, accessMiddleware('ADMIN'), userController.create);

// PUT
router.put('/:id', authMiddleware, accessMiddleware('ADMIN'), userController.edit);

// DELETE
router.delete('/:id', authMiddleware, accessMiddleware('ADMIN'), userController.delete);

module.exports = router;