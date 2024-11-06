const express = require('express')
const router = express.Router()
const seguridad = require('../seguridad')
const responses = require('../../../red/responses')
const controller = require('../controllers/rooms')
const { message } = require('../../../utils/messages')
const { isTeacher } = require('../isTeacher')

//crear rooms para el teacher
router.post('/rooms/create', seguridad(), isTeacher(), async (req, res) => {

    await controller.createRoom(req.user.usuario_id)
        .then((result) => {
            responses.success(req, res, result, 200)
        })
        .catch((err) => {

            console.error(err.message)
            responses.error(req, res, { message: "error al intentar guardar" }, 500)
        });
})



//lista todas las clases o rooms para el teacher
router.get('/rooms/all', seguridad(), isTeacher(), async (req, res) => {
    const { user } = req
    const rooms = await controller.getRooms(user.usuario_id)
    return responses.success(req, res, rooms, 200)
})

router.get('/room/:id', seguridad(), isTeacher(), async (req, res) => {
    const room_id = req.params.id

    console.log(room_id)
    const room = await controller.getRoom(room_id)
    responses.success(req, res, room, 200)
})

//editar clases virtuales
router.put("/room", seguridad(), isTeacher(), async (req, res) => {

    const body = req.body

    const { aula_id } = body

    await controller.updateRoom(aula_id, body)
        .then(result => responses.success(req, res, result, 200))
        .catch((err) => responses.error(req, res, { message: "imposible actualizar" }, 500))

    // await controller.getRoom(room_id).then(result => {
    //     return result
    //         ? controller.updateRoom(room_id, body)
    //             .then(result => responses.success(req, res, result, 200))
    //             .catch((e) => responses.error(req, res, e.message, 500))
    //         : responses.error(req, res, { message: "not match" }, 500)

    // }).catch((e) => responses.error(req, res, e.message, 500))

})

//crear rooms para el teacher
router.post('/rooms/delete', seguridad(), isTeacher(), async (req, res) => {

    const { body } = req

    controller.deleteRoom(body.aula_id)
        .then(result => {
            responses.success(req, res, result, 200)
        })
        .catch((err) => {

            console.error(err, err.message)
            responses.error(req, res, { message: "Error al borrar" }, 401)
        })

})


module.exports = router