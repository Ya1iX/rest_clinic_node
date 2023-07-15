const Router = require('express');
const router = new Router();
const userController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/refresh', userController.refresh)
router.post('/login', userController.login);
router.post('/logout', authMiddleware, userController.logout);
router.post('/register', userController.register);

module.exports = router;