/* eslint-disable camelcase */
const { getConnection } = require('../../DB/crud')
const TABLES = require('../../utils/tables')

// Obtener todas las verificaciones
const getAllVerifications = (callback) => {
  const query = `
        SELECT SQL_NO_CACHE DISTINCT v.id,
            CONCAT(u.nombre, ' ', u.apellido) AS nombre_completo, 
            u.correo, 
            v.verified, 
            v.state 
        FROM ${TABLES.USUARIOS} AS u
        INNER JOIN ${TABLES.VERIFICATIONS} AS v ON u.usuario_id = v.usuario_id
        INNER JOIN ${TABLES.ROLES} AS r ON u.rol_id = r.rol_id
        WHERE r.rol_id = 2 `

  getConnection().query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener todas las verificaciones:', err)
      return callback(err)
    }
    callback(null, results)
  })
}

// Obtener una verificación específica con imágenes
const getVerificationWithImages = async (id) => {
  try {
    const query = `
            SELECT DISTINCT id,
                CONCAT(u.nombre, ' ', u.apellido) AS nombre_completo, 
                u.correo, 
                v.verified, 
                v.state,
                v.state_message, 
                v.img_1, 
                v.img_2,
                u.estado
            FROM ${TABLES.USUARIOS} AS u
            INNER JOIN ${TABLES.VERIFICATIONS} AS v ON u.usuario_id = v.usuario_id
            INNER JOIN ${TABLES.ROLES} AS r ON u.rol_id = r.rol_id
            WHERE v.id = ? AND r.rol_id = 2 `

    const connection = await getConnection() // Obtener la conexión
    const [results] = await connection.promise().query(query, [id]) // Aquí se usa `.promise()`

    return results
  } catch (error) {
    console.error('Error al obtener la verificación con imágenes:', error)
    throw error
  }
}

const updateEstadoVef = async (id, estado) => {
  try {
    // Validar que 'estado' sea 0 o 1, si se pasa
    if (estado !== undefined && estado !== 0 && estado !== 1) {
      throw new Error('Valor de estado inválido')
    }

    // Construcción dinámica de la consulta SQL con INNER JOIN
    const query = `
        UPDATE ${TABLES.USUARIOS} AS u
        INNER JOIN ${TABLES.VERIFICATIONS} AS v ON u.usuario_id = v.usuario_id
        SET u.estado = ?
        WHERE v.id = ?`

    const values = [estado, id]

    // Ejecutar la consulta
    const connection = await getConnection()
    const [result] = await connection.promise().query(query, values)

    if (result.affectedRows === 0) {
      throw new Error('No se encontró ninguna verificación con el ID proporcionado')
    }

    return { message: 'Estado actualizado correctamente', affectedRows: result.affectedRows }
  } catch (error) {
    console.error('Error al actualizar el estado de la verificación:', error)
    throw error
  }
}

const updateVerificationState = async (id, state, verified, state_message) => {
  try {
    // Validar que 'verified' sea 0 o 1
    if (verified !== 0 && verified !== 1) {
      throw new Error('Valor de verificación inválido')
    }

    // Construcción dinámica de la consulta SQL
    let query = `UPDATE ${TABLES.VERIFICATIONS} SET `
    const values = []

    if (state !== undefined) {
      query += 'state = ?, '
      values.push(state)
    }
    if (verified !== undefined) {
      query += 'verified = ?, '
      values.push(verified) // Asegúrate de que el valor de 'verified' sea un número
    }
    if (state_message !== undefined) {
      query += 'state_message = ?, '
      values.push(state_message)
    }
    // Remover la última coma y agregar la condición WHERE
    query = query.slice(0, -2) + ' WHERE id = ?'
    values.push(id)

    const connection = await getConnection()
    const [result] = await connection.promise().query(query, values)

    if (result.affectedRows === 0) {
      throw new Error('No se encontró ninguna verificación con el ID proporcionado')
    }

    return { message: 'Estado actualizado correctamente', affectedRows: result.affectedRows }
  } catch (error) {
    console.error('Error al actualizar el estado de la verificación:', error)
    throw error
  }
}

const deleteImage = async (id, imageColumn) => {
  try {
    // Verificar que 'imageColumn' sea válido (img_1 o img_2)
    if (imageColumn !== 'img_1' && imageColumn !== 'img_2') {
      throw new Error('Nombre de columna de imagen no válido')
    }

    // Construcción de la consulta SQL para actualizar la columna de imagen
    // Si es img_1 o img_2 o ambas
    const query = `
           UPDATE ${TABLES.VERIFICATIONS}
           SET ${imageColumn} = NULL
           WHERE id = ? AND (${imageColumn} IS NOT NULL)
        `

    const connection = await getConnection()
    const [result] = await connection.promise().query(query, [id])

    if (result.affectedRows === 0) {
      throw new Error('No se encontró ninguna verificación con el ID proporcionado o la imagen ya está vacía')
    }

    return { message: 'Imagen eliminada correctamente', affectedRows: result.affectedRows }
  } catch (error) {
    console.error('Error al eliminar la imagen:', error)
    throw error
  }
}

module.exports = {
  getAllVerifications,
  getVerificationWithImages,
  updateVerificationState,
  updateEstadoVef,
  deleteImage

}
