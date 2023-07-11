const ApiError = require('../replies/ApiError');

module.exports = function(req, res, next) {
    next(ApiError.notFound(`Cannot ${req.method} ${req.path}`))
}