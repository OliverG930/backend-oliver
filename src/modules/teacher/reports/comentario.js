/* eslint-disable camelcase */
const db = require('../../../DB/crud')
const TABLES = require('../../../utils/tables')
const { getConnection } = require('../../../DB/crud')
// Función para guardar un nuevo comentario
const saveComment = async (data) => {
  try {
    // Validar datos obligatorios
    if (!data.room || !data.user_id || !data.comentario) {
      console.log(data.room, data.user_id)
      throw new Error('Faltan datos obligatorios: room, user_id o comentario')
    }

    // Insertar un nuevo comentario
    const insertData = {
      room: data.room,
      user_id: data.user_id,
      comentario: data.comentario
    }

    return await db.insert(TABLES.COMMENTS, insertData)
  } catch (error) {
    console.error('Error al guardar el comentario:', error.message)
    return {
      success: false,
      message: 'Error al guardar el comentario',
      error: error.message
    }
  }
}

// Función para actualizar un comentario existente
const updateComment = async (data) => {
  try {
    // Validar datos obligatorios
    if (!data.userId || !data.comentario) {
      throw new Error('Faltan datos obligatorios: room, user_id, comentario o com_id')
    }

    // Actualizar el comentario
    const result = await db.update(TABLES.COMMENTS, { comentario: data.comentario }, {
      user_id: data.userId // Solo utilizamos com_id en el WHERE para encontrar el comentario
    })

    return result
  } catch (error) {
    console.error('Error al actualizar el comentario:', error.message)
  }
}

const selectAlumno = (req, res) => {
  const { nombre, apellido, aula_id } = req.params // Get URL parameters

  console.log('Received parameters:', { nombre, apellido, aula_id }) // Debugging

  if (!nombre || !apellido || !aula_id) {
    return res.status(400).json({ error: 'Missing required parameters' })
  }

  const query = `
    SELECT u.usuario_id
    FROM aula_virtual AS av
    JOIN usuarios as u on u.usuario_id = u.usuario_id
    JOIN roles AS r ON r.rol_id = u.rol_id
    WHERE r.rol_id = 1
    AND u.nombre LIKE ?
    AND u.apellido LIKE ?
    AND av.aula_id = ?
  `

  // Using parameterized queries to prevent SQL injection
  getConnection().query(query, [`${nombre}`, `${apellido}`, aula_id], (err, results) => {
    console.log([`%${nombre}%`, `%${apellido}%`, aula_id]) // Debugging

    if (err) {
      console.error('Error executing query:', err)
      return res.status(500).json({ error: 'Error fetching data' })
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Student not found' })
    }

    res.json({ alumnos: results })
  })
}

module.exports = { saveComment, updateComment, selectAlumno }
