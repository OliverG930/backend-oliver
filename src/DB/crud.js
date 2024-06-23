const mysql = require('./mysql')

const connection = mysql.conn()

//selecciona de la tabla el primer dato de la consulta recibido desde el  parametro data con este formato {id_usaurio: 1}
const selectOneWhere = (table, data) => {
    return new Promise((_res, _rej) => {
        connection.query(`SELECT * FROM ${table} WHERE ?`, data, (err, result) => {
            return err ? _rej(err) : _res(result[0])
        })
    })
}

const select = (table, data) => {
    return new Promise((_res, _rej) => {
        connection.query(`SELECT * FROM ${table} WHERE ?`, data, (err, result) => {
            return err ? _rej(err) : _res(result)
        })
    })
}

const selectAll = (table) => {
    return new Promise((_res, _rej) => {
        connection.query(`select * from ${table}`, (err, result) => {
            return err ? _rej(err) : _res(result[0])
        })
    })
}


//inserta en la tabla 'table' los datos recibidos desde el  parametro data con este formato {id_usaurio: 1, nombre: 'Marcos', id_rol: 1}
const insert = (table, data) => {
    return new Promise((_res, _rej) => {
        connection.query(`INSERT INTO ${table} SET ?`, data, (err, result) => {
            return err ? _rej(err) : _res(result)
        })
    })
}


const update = async (table, data, where) => {

    return new Promise((_res, _rej) => {
        connection.query(`UPDATE ${table} SET ? WHERE ?`, [data, where], (err, result) => {
            return err ? _rej(err) : _res(result)
        })
    })
}

const deleteWhereID = (table, where) => {
    return new Promise((_res, _rej) => {
        connection.query(`DELETE FROM ${table} where ?`, where, (err, result) => {
            return err ? _rej(err) : _res(result)
        })
    })
}


module.exports = {
    insert,
    update,
    selectOneWhere,
    select,
    deleteWhereID,
    selectAll
}