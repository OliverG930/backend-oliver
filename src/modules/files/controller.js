const db = require('../../DB/crud')

const TABLES = require('../../utils/tables')

const save = async (data) => {
  const myData = {
    name: data.file.filename,
    tipo_archivo: data.file.mimetype,
    ruta_archivo: data.file.path,
    aula_id: data.aula_id,
    user_id: data.user_id
  }

  return db.insert(TABLES.FILES, myData)
}

const getFileWithRoomId = (aula_id) => {
  return db.select(TABLES.FILES, { aula_id })
}

const getFileFromDB = async (fileID) => {
  return db.select(TABLES.FILES, { archivo_id: fileID })
}

const deleteFileFromDB = (fileID) => {
  return db.deleteWhereID(TABLES.FILES, { archivo_id: fileID })
}

module.exports = { save, getFileFromDB, deleteFileFromDB, getFileWithRoomId }
