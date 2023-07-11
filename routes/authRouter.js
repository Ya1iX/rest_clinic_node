const Router = require('express');
const router = new Router();
const userController = require('../controllers/UserController');

router.get('/check', userController.check)
router.post('/login', userController.login);
router.post('/register', userController.register);

module.exports = router;