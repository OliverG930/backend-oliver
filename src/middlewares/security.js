const auth = require('../auth')

const security = () => {
  const middleware = (req, _, next) => {
    auth.checkToken.confirmToken(req)
    next()
  }

  return middleware
}

module.exports = security
