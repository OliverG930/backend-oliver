const mysql = require('./mysql')
const connection = mysql.conn()

function getConnection () {
  return connection
}

// selecciona de la tabla el primer dato de la consulta recibido desde el  parametro data con este formato {id_usuario: 1}
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

const selectResume = (table, user_id, exam_id) => {
  return new Promise((_res, _rej) => {
    connection.query(`SELECT * FROM ${table} WHERE user_id = ? AND exam_id = ?`, [user_id, exam_id], (err, result) => {
      return err ? _rej(err) : _res(result[0])
    })
  })
}

const selectWithJoin = (table_one, table_two, condition, where) => {
  return new Promise((_res, _rej) => {
    const query = `
            SELECT * FROM ${table_one}
            JOIN ${table_two} ON ${condition}
            WHERE ${Object.keys(where).map(key => `${key} = ?`).join(' AND ')}
        `
    // Extraer los valores de la condición WHERE
    const values = Object.values(where)
    connection.query(query, values, (err, result) => {
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

const get = (table) => {
  return new Promise((_res, _rej) => {
    connection.query(`select * from ${table}`, (err, result) => {
      return err ? _rej(err) : _res(result)
    })
  })
}

// inserta en la tabla 'table' los datos recibidos desde el  parametro data con este formato {id_usuario: 1, nombre: 'Marcos', id_rol: 1}
const insert = (table, data) => {
  return new Promise((_res, _rej) => {
    connection.query(`INSERT INTO ${table} SET ?`, data, (err, result) => {
      return err ? _rej(err) : _res(result)
    })
  })
}

const insertWhere = (table, data, where) => {
  // Construir la parte de la consulta WHERE dinámicamente
  const conditions = Object.keys(where).map(key => `${key} = ?`).join(' AND ')
  const values = Object.values(where)

  const checkQuery = `SELECT COUNT(*) AS count FROM ${table} WHERE ${conditions}`

  return new Promise((resolve, reject) => {
    connection.query(checkQuery, values, (err, results) => {
      if (err) {
        return reject(err)
      }

      if (results[0].count > 0) {
        return resolve({ message: 'Data already exists', exists: true })
      }

      // Si no existen, realiza la inserción
      const insertQuery = `INSERT INTO ${table} SET ?`
      connection.query(insertQuery, data, (err, result) => {
        return err ? reject(err) : resolve(result)
      })
    })
  })
}

const update = async (table, data, where) => {
  return new Promise((resolve, reject) => {
    connection.query(`UPDATE ${table} SET ? WHERE ?`, [data, where], (err, result) => {
      return err ? reject(err) : resolve(result)
    })
  })
}

const deleteWhereID = (table, where) => {
  return new Promise((resolve, reject) => {
    connection.query(`DELETE FROM ${table} where ?`, where, (err, result) => {
      return err ? reject(err) : resolve(result)
    })
  })
}

module.exports = {
  insert,
  update,
  selectOneWhere,
  select,
  deleteWhereID,
  selectAll,
  get,
  insertWhere,
  selectWithJoin,
  getConnection,
  selectResume
}
