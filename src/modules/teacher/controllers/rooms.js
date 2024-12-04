/* eslint-disable camelcase */
const db = require('../../../DB/crud')
const TABLES = require('../../../utils/tables')

const getRooms = (usuario_id) => {
  return db.select(TABLES.AULA_VIRTUAL, { usuario_id })
}

const getUserRoom = ({ id }) => {
  return new Promise((resolve, reject) => {
    if (!id || typeof id !== 'number') {
      return reject(new Error('Invalid ID provided'))
    }
    const query = `
      SELECT  usuarios.usuario_id, usuarios.nombre, usuarios.apellido 
      FROM courses 
      INNER JOIN usuarios ON courses.user = usuarios.usuario_id
      WHERE courses.aula = ?`

    db.getConnection().query(query, [id], (err, result) => {
      if (err) {
        return reject(err)
      }
      return resolve(result)
    })
  })
}

// crea una nueva room según el usuario
const createRoom = (usuario_id) => db.insert(TABLES.AULA_VIRTUAL, { usuario_id })

const createVirtualRoom = (body) => {
  const data = {
    nombre_aula: body.name,
    nivel: body.level,
    aula_descripcion: body.desc,
    usuario_id: body.id
  }

  return db.insert(TABLES.AULA_VIRTUAL, data)
}

const deleteRoom = async (aula_id) => {
  return await db.deleteWhereID(TABLES.AULA_VIRTUAL, { aula_id })
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
  getRooms,
  createRoom,
  deleteRoom,
  getRoom,
  getUserRoom
}
