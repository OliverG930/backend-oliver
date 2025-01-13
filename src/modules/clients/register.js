const express = require('express')
const router = express.Router()
const responses = require('../../red/responses')
const controller = require('../../modules/clients/registerController')
const messages = require('../../utils/messages')

router.post('/', async (req, res) => {
  // recibe los datos enviados por el usuario desde un formulario en tipo JSON
  const body = req.body

  const name = body.name
  const lastName = body.lastName
  const email = body.email
  const password = body.password
  const rol_id = body.rol_id ?? 1

  // capa de seguridad para detectar si los campos no son vacíos
  if (name === '' || !name) {
    return responses.error(req, res, { message: messages.err_messages.NAME_REQUIRED }, 500)
  }

  if (lastName === '' || !lastName) {
    return responses.error(req, res, { message: messages.err_messages.LAST_NAME_REQUIRED }, 500)
  }

  if (email === '' || !email) {
    return responses.error(req, res, { message: messages.err_messages.EMAIL_REQUIRED }, 500)
  }

  if (password === '' || !password) {
    return responses.error(req, res, { message: messages.err_messages.PASSWORD_REQUIRED }, 500)
  }

  try {
    // controlador se encarga de hacer la consulta o insert de los datos enviados por el usuario
    const data = await controller.register({ name, lastName, rol_id, email, password })

    // si la data recibe un error
    if (data.error) {
      return responses.error(req, res, data.message, 500)
    }
    responses.success(req, res, data, 200)
  } catch (err) {
    responses.error(req, res, err, 500)
  }
})

router.post('/teacher', async (req, res) => {
  // recibe los datos enviados por el usuario desde un formulario en tipo JSON
  const body = req.body

  const name = body.name
  const lastName = body.lastName
  const email = body.email
  const password = body.password
  const rol_id = body.rol_id ?? 1

  // capa de seguridad para detectar si los campos no son vacíos
  if (name === '' || !name) {
    return responses.error(req, res, { message: messages.err_messages.NAME_REQUIRED }, 500)
  }

  if (lastName === '' || !lastName) {
    return responses.error(req, res, { message: messages.err_messages.LAST_NAME_REQUIRED }, 500)
  }

  if (email === '' || !email) {
    return responses.error(req, res, { message: messages.err_messages.EMAIL_REQUIRED }, 500)
  }

  if (password === '' || !password) {
    return responses.error(req, res, { message: messages.err_messages.PASSWORD_REQUIRED }, 500)
  }

  try {
    // controlador se encarga de hacer la consulta o insert de los datos enviados por el usuario
    const data = await controller.registerTeacher({ name, lastName, rol_id, email, password, estado: 0 })

    // si la data recibe un error
    if (data.error) {
      return responses.error(req, res, data.message, 500)
    }
    responses.success(req, res, data, 200)
  } catch (err) {
    responses.error(req, res, err, 500)
  }
})

module.exports = router
