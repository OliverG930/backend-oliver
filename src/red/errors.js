const responses = require('./responses')

const errors = (err, req, res, next) => {
  const message = err.message || 'error'
  const status = err.status || 500

  console.log(message)

  responses.error(req, res, { message }, status)
}

module.exports = errors
