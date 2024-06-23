const express = require('express')
const router = express.Router()
const resposes = require('../../red/responses')
const controller = require('../../modules/clients/registerController')
const messages = require('../../utils/messages')

router.post('/', async (req, res) => {

    //recibe los datos enviados por el usuario desde un formulario en tipo JSON
    const body = req.body

    const name = body.name
    const email = body.email
    const password = body.password

    //capa de seguridad para detectar si los campos no son vacios
    if (name === "" || !name) {
        return resposes.error(req, res, { message: messages.err_messages.NAME_REQUIRED }, 500)
    }

    if (email === "" || !email) {
        return resposes.error(req, res, { message: messages.err_messages.EMAIL_REQUIRED }, 500)
    }

    if (password === "" || !password) {
        return resposes.error(req, res, { message: messages.err_messages.PASSWORD_REQUIRED }, 500)
    }

    try {
        //controlador se encarga de hacer la consulta o insert de los datos enviados por el usuario
        const data = await controller.register({ name, email, password })

        //si la data recibe un error 
        if (data.error) {
            return resposes.error(req, res, data.message, 500)
        }
        resposes.success(req, res, data, 200)
    } catch (err) {
        resposes.error(req, res, err, 500)
    }

})

module.exports = router