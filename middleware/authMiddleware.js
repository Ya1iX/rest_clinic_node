const ApiError = require('../replies/ApiError');
const JwtService = require('../services/JwtService');
const UserService = require('../services/UserService');

module.exports = async function (req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(ApiError.unauthorized());
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return next(ApiError.unauthorized());
        }

        const tokenData = JwtService.validateAccessToken(token);
        if (!tokenData) {
            return next(ApiError.unauthorized());
        }

        req.user = await UserService.getById(tokenData.id, ['full']);
        next();
    } catch (e) {
        next(ApiError.unauthorized());
    }
}