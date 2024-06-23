const auth = require('../../auth')

module.exports = checkAuth = () => {
    const middleware = (req, res, next) => {
        auth.checkToken.confirmToken(req)
        next()
    }

    return middleware
}