const express = require('express')
const router = express.Router()
const responses = require('../../red/responses')
const controller = require('./loginController')

router.post('/', async (req, res) => {
  // datos recibidos del front
  const body = req.body
  // controlador del sistema de login
  // retorna el usuario si los datos son correctos   (correo y contraseña)
  const user = await controller.login(body)

  // si el controlador no retorna un usuario o retorna un error
  if (!user) {
    // si el usuario no se encuentra
    return responses.error(req, res, { message: 'no user detected' }, 500)
  }

  // si el usuario retorna un error
  if (user.error) {
    return responses.error(req, res, { message: user.error }, 500)
  }

  // si no existen errores, retorna el usuario
  responses.success(req, res, user, 200)
})

module.exports = router
