const express = require('express')
const router = express.Router()
const seguridad = require('../seguridad')
const resposes = require('../../../red/responses')
const controller = require('../controllers/rooms')

//consulta todas las entradas de la db que contengan el id del usuario seleccionado
router.get('/all-rooms/:id', seguridad(), async (req, res, next) => {
    //id de usuario recibido por parametro id
    const usuario_id = req.params.id


    if (!usuario_id || usuario_id === '') {
        return resposes.error(req, res, { message: 'user ID required!' })
    }

    const getAll = await controller.getAllRooms(usuario_id)
    return resposes.success(req, res, getAll, 200)
})

router.post('/add-virtual-room', seguridad(), async (req, res, next) => {
    const body = req.body
    const createVirtualRoom = await controller.createVirtualRoom(body)
    return resposes.success(req, res, { message: 'added correctly', insertId: createVirtualRoom.insertId }, 200)
})

router.delete('/delete-virtual-room/:id', seguridad(), async (req, res, next) => {
    const virtual_room_id = req.params.id
    const usuario_id = req.user.usuario_id
    const checkVirtualRoom = await controller.deleteVirtualRoom(virtual_room_id, usuario_id)

    const response = checkVirtualRoom.error ?
        resposes.error(req, res, { message: checkVirtualRoom.error }, 200) :
        resposes.success(req, res, { message: 'borrando', response: checkVirtualRoom }, 200)

    return response
})

router.get('/room/:id', seguridad(), async (req, res, next) => {
    //id de usuario recibido por parametro id
    const roomId = req.params.id

    const get = await controller.getRoom(roomId, req)
    return resposes.success(req, res, get, 200)
})

//editar clases virtuales
router.put("/room/:id", seguridad(), async (req, res) => {

    const room_id = req.params.id
    const body = req.body

    await controller.getRoom(room_id).then(result => {
        return result
            ? controller.updateRoom(room_id, body)
                .then(result => resposes.success(req, res, result, 200))
                .catch((e) => resposes.error(req, res, e.message, 500))
            : resposes.error(req, res, { message: "not match" }, 500)

    }).catch((e) => resposes.error(req, res, e.message, 500))

})


module.exports = router