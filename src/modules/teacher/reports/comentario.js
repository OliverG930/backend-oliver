const db = require("../../../DB/crud");
const TABLES = require("../../../utils/tables");
const { getConnection } = require('../../../DB/crud')
// Función para guardar un nuevo comentario
const saveComment = async (data) => {
  try {
    // Validar datos obligatorios
    if (!data.room || !data.user_id || !data.comentario) {
      throw new Error("Faltan datos obligatorios: room, user_id o comentario");
    }

    // Insertar un nuevo comentario
    const insertData = {
      room: data.room,
      user_id: data.user_id,
      comentario: data.comentario,
    };

    const result = await db.insert(TABLES.COMMENTS, insertData);
    return {
      success: true,
      message: "Comentario guardado exitosamente",
      data: result,
    };
  } catch (error) {
    console.error("Error al guardar el comentario:", error.message);
    return {
      success: false,
      message: "Error al guardar el comentario",
      error: error.message,
    };
  }
};

// Función para actualizar un comentario existente
const updateComment = async (data) => {
  try {
    // Validar datos obligatorios
    if (!data.room || !data.user_id || !data.comentario || !data.com_id) {
      throw new Error("Faltan datos obligatorios: room, user_id, comentario o com_id");
    }

    // Verificar si el comentario existe
    const existingComment = await db.select(TABLES.COMMENTS, {
      com_id: data.com_id,
    
    });

    if (existingComment.length === 0) {
      return {
        success: false,
        message: "No se encontró el comentario con los parámetros proporcionados.",
      };
    }

    // Actualizar el comentario
    const updateData = {
      comentario: data.comentario, // Solo se actualiza la columna comentario
    };

    const result = await db.update(TABLES.COMMENTS, updateData, {
      com_id: data.com_id, // Solo utilizamos com_id en el WHERE para encontrar el comentario
    });

    return {
      success: true,
      message: "Comentario actualizado exitosamente",
      data: result,
    };
  } catch (error) {
    console.error("Error al actualizar el comentario:", error.message);
    return {
      success: false,
      message: "Error al actualizar el comentario",
      error: error.message,
    };
  }
};


const selectAlumno = (req, res) => {
  const { nombre, apellido, aula_id } = req.params;  // Get URL parameters

  console.log('Received parameters:', { nombre, apellido, aula_id });  // Debugging

  if (!nombre || !apellido || !aula_id) {
    return res.status(400).json({ error: 'Missing required parameters' });
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
  `;

  // Using parameterized queries to prevent SQL injection
  getConnection().query(query, [`${nombre}`, `${apellido}`, aula_id], (err, results) => {
    console.log([`%${nombre}%`, `%${apellido}%`, aula_id]);  // Debugging

    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Error fetching data' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ alumnos: results });
  });
};




module.exports = { saveComment, updateComment,selectAlumno };
