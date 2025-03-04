const { getConnection, select } = require('../../DB/crud');
const TABLES = require('../../utils/tables');

// Obtener los exámenes pendientes
const getExams = async (id) => {
    try {
      
        const query = `
          SELECT SQL_NO_CACHE
            JSON_UNQUOTE(JSON_EXTRACT(ex.config, '$.title')) AS title,
            av.nivel,
            DATE_FORMAT(ex.expires_at, '%d/%m/%Y') AS expires_at
          FROM ${TABLES.AULA_VIRTUAL} AS av
          INNER JOIN ${TABLES.EXAMS} AS ex ON ex.roomID = av.aula_id
          INNER JOIN ${TABLES.USUARIOS} AS u ON u.usuario_id = av.usuario_id
          WHERE u.usuario_id = ? 
          AND u.rol_id = 2
          AND ex.expires_at >= CURDATE()
      `;
        const connection = await getConnection(); 
        const [results] = await connection.promise().query(query, [id]); 
  
        return results;
    } catch (error) {
        console.error('Error al obtener los exámenes pendientes:', error);
        throw error;
    }
  };

  const getCountAulas = async (id) => {
    try {
      const query = `
        SELECT COUNT(av.aula_id) AS aulas
        FROM ${TABLES.AULA_VIRTUAL} AS av
        INNER JOIN ${TABLES.USUARIOS} AS u ON u.usuario_id = av.usuario_id
        WHERE u.usuario_id = ? AND u.rol_id = 2
      `;
  
      const connection = await getConnection();
      const [results] = await connection.promise().query(query, [id]);
  
      return results[0].aulas; // Retorna solo el número de aulas
    } catch (error) {
      console.error('Error al obtener la cantidad de aulas:', error);
      throw error;
    }
  };
  

  const getCountFiles = async (userId, aulaId) => {
    try {
      const query = `
        SELECT COUNT(ar.archivo_id) AS archivos
        FROM ${TABLES.FILES} AS ar
        INNER JOIN ${TABLES.USUARIOS} AS u ON u.usuario_id = ar.user_id
        INNER JOIN ${TABLES.AULA_VIRTUAL} AS av ON av.usuario_id = u.usuario_id
        WHERE u.usuario_id = ? AND av.aula_id = ? AND u.rol_id = 2
      `;
  
      const connection = await getConnection();
      const [results] = await connection.promise().query(query, [userId, aulaId]);
  
      return results[0].archivos; // Devuelve la cantidad de archivos
    } catch (error) {
      console.error('Error al obtener la cantidad de archivos:', error);
      throw error;
    }
  };
  
  const getCountTareas = async (userId, aulaId) => {
    try {
      const query = `
        SELECT COUNT(t.tarea_id) AS tareas
        FROM ${TABLES.TASKS} AS t
        INNER JOIN ${TABLES.AULA_VIRTUAL} AS av ON av.aula_id = t.id_room
        INNER JOIN ${TABLES.USUARIOS} AS u ON u.usuario_id = av.usuario_id
        WHERE u.usuario_id = ? AND av.aula_id = ? AND u.rol_id = 2
      `;
  
      const connection = await getConnection();
      const [results] = await connection.promise().query(query, [userId, aulaId]);
  
      return results[0].tareas; // Retorna el número de tareas
    } catch (error) {
      console.error('Error al obtener la cantidad de tareas:', error);
      throw error;
    }
  };
  
  const getCountAlumnos = async (userId) => {
    try {
      const query = `
        SELECT COUNT(DISTINCT c.user) AS alumnos
        FROM ${TABLES.COURSES} AS c
        INNER JOIN ${TABLES.USUARIOS} AS u ON u.usuario_id = c.user
        INNER JOIN ${TABLES.AULA_VIRTUAL} AS av ON av.aula_id = c.aula
        WHERE u.rol_id = 1 -- Solo alumnos
        AND av.usuario_id = ? -- Docente específico relacionado con las aulas
      `;
    
      const connection = await getConnection();
      const [results] = await connection.promise().query(query, [userId]);
    
      return results[0].alumnos; // Retorna el número de alumnos únicos
    } catch (error) {
      console.error('Error al obtener la cantidad de alumnos:', error);
      throw error;
    }
  };
  

  const getListaAlumnos = async (userId) => {
    try {
      const query = `
        SELECT DISTINCT CONCAT(u.nombre, ' ', u.apellido) AS alumno, u.correo
        FROM ${TABLES.COURSES} AS c
        INNER JOIN ${TABLES.USUARIOS} AS u ON u.usuario_id = c.user
        INNER JOIN ${TABLES.AULA_VIRTUAL} AS av ON av.aula_id = c.aula
        WHERE u.rol_id = 1 -- Solo alumnos
        AND av.usuario_id = ? -- Docente específico relacionado con las aulas
      `;
      
      const connection = await getConnection();
      const [results] = await connection.promise().query(query, [userId]);
      
      return results; // Retorna la lista completa de alumnos con nombre y correo
    } catch (error) {
      console.error('Error al obtener la lista de alumnos:', error);
      throw error;
    }
  };
  





module.exports = {
    getExams,
    getCountAulas,
    getCountFiles,
    getCountTareas,
    getCountAlumnos,
    getListaAlumnos
};
