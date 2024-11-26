const responses = require('../../red/responses')

function isTeacher () {
  const middleware = (req, res, next) => {
    const { user } = req
    // detectar si es un teacher
    if (user.rol_id !== 2) return responses.error(req, res, { message: 'usuario no teacher' }, 500)
    next()
  }

  return middleware
}
exports.isTeacher = isTeacher
