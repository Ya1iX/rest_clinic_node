const ApiError = require("../replies/ApiError");

module.exports = function (role) {
    return function (req, res, next) {
        try {
            if (!req.user.roles.includes(role)) {
                return next(ApiError.forbidden());
            }
            next();
        } catch (e) {
            next(ApiError.forbidden());
        }
    }
}