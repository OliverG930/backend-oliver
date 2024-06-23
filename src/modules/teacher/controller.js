const db = require('../../DB/crud')
const { err_messages } = require('../../utils/messages')
const TABLES = require("../../utils/tables")

const getAllRooms = (usuario_id) => {
    return db.select(TABLES.AULA_VIRTUAL, { usuario_id: usuario_id })
}

const createVirtualRoom = (body) => {
    const data = {
        nombre_aula: body.name,
        nivel: body.level,
        aula_descripcion: body.desc,
        usuario_id: body.id
    }

    return db.insert(TABLES.AULA_VIRTUAL, data)
}


const deleteVirtualRoom = async (id_room, user_id) => {
    const table = 'tcc.aula_virtual'

    const virtual_room = await db.select(TABLES.AULA_VIRTUAL, { aula_id: id_room })


    if (virtual_room[0].usuario_id === user_id) {
        return await db.deleteWhereID(table, { aula_id: id_room })
    } else {
        return { error: err_messages.CANT_DELETE }
    }
}

const getRoom = async (id_room) => {
    return await db.selectOneWhere(TABLES.AULA_VIRTUAL, { aula_id: id_room })
}

const updateRoom = async (id_room, data) => {
    return await db.update(TABLES.AULA_VIRTUAL, data, { aula_id: id_room })
}

module.exports = {
    createVirtualRoom,
    updateRoom,
    getAllRooms,
    deleteVirtualRoom,
    getRoom
}