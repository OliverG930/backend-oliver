const mysql = require('./mysql')
const connection = mysql.conn()

function getConnection () {
  return connection
}

// selecciona de la tabla el primer dato de la consulta recibido desde el  parametro data con este formato {id_usuario: 1}
const selectOneWhere = (table, data) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${table} WHERE ?`, data, (err, result) => {
      return err ? reject(err) : resolve(result[0])
    })
  })
}

const select = (table, data) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${table} WHERE ?`, data, (err, result) => {
      return err ? reject(err) : resolve(result)
    })
  })
}

const selectMultipleWheres = (table, multipleWheres = {}) => {
  const inWhere = Object.keys(multipleWheres).map(key => `${key} = ?`).join(' AND ')
  const values = Object.values(multipleWheres)

  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${table} WHERE ${inWhere}`, values, (err, result) => {
      return err ? reject(err) : resolve(result)
    })
  })
}

const selectResume = (table, userId, examId) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${table} WHERE user_id = ? AND exam_id = ?`, [userId, examId], (err, result) => {
      return err ? reject(err) : resolve(result[0])
    })
  })
}

const selectWithJoin = (tableOne, tableTwo, condition, where) => {
  return new Promise((resolve, reject) => {
    const query = `
            SELECT * FROM ${tableOne}
            JOIN ${tableTwo} ON ${condition}
            WHERE ${Object.keys(where).map(key => `${key} = ?`).join(' AND ')}
        `
    // Extraer los valores de la condición WHERE
    const values = Object.values(where)
    connection.query(query, values, (err, result) => {
      return err ? reject(err) : resolve(result)
    })
  })
}

const selectAll = (table) => {
  return new Promise((resolve, reject) => {
    connection.query(`select * from ${table}`, (err, result) => {
      return err ? reject(err) : resolve(result[0])
    })
  })
}

const get = (table) => {
  return new Promise((resolve, reject) => {
    connection.query(`select * from ${table}`, (err, result) => {
      return err ? reject(err) : resolve(result)
    })
  })
}

// inserta en la tabla 'table' los datos recibidos desde el  parametro data con este formato {id_usuario: 1, nombre: 'Marcos', id_rol: 1}
const insert = (table, data) => {
  return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO ${table} SET ?`, data, (err, result) => {
      return err ? reject(err) : resolve(result)
    })
  })
}

const insertWhere = (table, data, where) => {
  // Construir la parte de la consulta WHERE dinámica
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

const insertWhereV2 = async (table, data, where) => {
  if (!table || typeof table !== 'string') {
    throw new Error('Invalid table name')
  }
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    throw new Error('Invalid data object')
  }
  if (!where || typeof where !== 'object' || Object.keys(where).length === 0) {
    throw new Error('Invalid where conditions')
  }

  // Construir la parte dinámica de la consulta WHERE
  const whereConditions = Object.keys(where)
    .map(key => `${key} = ?`)
    .join(' AND ')
  const whereValues = Object.values(where)

  // Construir la consulta con INSERT ... SELECT
  const keys = Object.keys(data).join(', ')
  const placeholders = Object.keys(data)
    .map(() => '?')
    .join(', ')
  const values = Object.values(data)

  const query = `
    INSERT INTO ?? (${keys})
    SELECT ${placeholders}
    WHERE NOT EXISTS (
      SELECT 1 FROM ?? WHERE ${whereConditions}
    );
  `

  try {
    // Ejecutar la consulta
    const result = await queryAsync(query, [table, ...values, table, ...whereValues])
    return result.affectedRows > 0
      ? { message: 'Data inserted successfully', exists: false }
      : { message: 'Data already exists', exists: true }
  } catch (error) {
    throw new Error(`Database operation failed: ${error.message}`)
  }
}

// Función auxiliar para consultas asincrónicas
const queryAsync = (query, params) => {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, results) => {
      if (err) {
        return reject(err)
      }
      resolve(results)
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
  insertWhereV2,
  selectWithJoin,
  getConnection,
  selectResume,
  selectMultipleWheres
}
