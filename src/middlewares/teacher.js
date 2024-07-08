const messages = require("../utils/messages")
const { ROLES } = require("../utils/roles")

const IsTeacher = () => {

    const check = (req, res, next) => {
        const teacher = req.user
        if (teacher.rol_id !== ROLES.TEACHER) responses.error(req, res, { message: messages.err_messages.NO_TEACHER }, 500)
        next()
    }

    return check
}

module.exports = IsTeacher