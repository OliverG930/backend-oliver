const express = require('express')
const router = express.Router()
const seguridad = require('./seguridad')
const resposes = require('../../red/responses')
const lesson_controller = require('./controllers/lesson')


//consulta todas las entradas de la db que contengan el id del usuario seleccionado
router.get('/get-lesson/:id', seguridad(), async (req, res, next) => {
    //id de usuario recibido por parametro id
    const usuario_id = req.params.id

})