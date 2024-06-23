const auth = require("../auth")

const security = () => {
    const middleware = (req, res, next) => {
        auth.checkToken.confirmToken(req)
        next()
    }

    return middleware
}

module.exports = security