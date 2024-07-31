const db = require("../../DB/crud")

const TABLES = require("../../utils/tables")

const save = async (data) => {

    const myData = {
        name: data.file.filename,
        tipo_archivo: data.file.mimetype,
        ruta_archivo: data.file.path,
        aula_id: data.aula_id,
        user_id: data.user_id,
        leccion_id: data.leccion_id
    }

    return db.insert(TABLES.FILES, myData)
}

const getFileFromDB = async (fileID) => {
    return db.select(TABLES.FILES, { archivo_id: fileID })
}


const deleteFileFromDB = (fileID) => {
    return db.deleteWhereID(TABLES.FILES, { archivo_id: fileID })
}

module.exports = { save, getFileFromDB, deleteFileFromDB }