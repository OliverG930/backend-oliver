/* eslint-disable camelcase */
/*
const PDFDocument = require('pdfkit')
const { getConnection, select } = require('../../../DB/crud')
const { saveComment, updateComment } = require('./comentario')
const responses = require('../../../red/responses')
const tables = require('../../../utils/tables')

async function generateReport (req, res) {
  const { nombre, apellido } = req.user

  const { ne, id_aula } = req.query
  if (!ne || !id_aula) {
    return res.status(400).json({ error: 'Faltan parámetros necesarios: ne, PRN, id_aula' })
  }

  // try {
  const query = `
            WITH
                tareas_points AS (
                    SELECT user_id, SUM(points) AS total_tareas_points
                    FROM tareas_content
                    GROUP BY user_id
                ),
                exam_points AS (
                    SELECT user_id, SUM(points) AS total_exam_points
                    FROM exams_users
                    GROUP BY user_id
                )
            SELECT
                av.nombre_aula,
                CONCAT(u.nombre, ' ', u.apellido) AS estudiante,
                CONCAT(d.nombre, ' ', d.apellido) AS profesor, -- Profesor con rol_id=2
                c.comentario,
                DATE_FORMAT(NOW(), '%d/%m/%Y') AS fecha_actual,
                COALESCE(tp.total_tareas_points, 0) AS tareas_points,
                COALESCE(ep.total_exam_points, 0) AS exam_points,
                COALESCE(tp.total_tareas_points, 0) + COALESCE(ep.total_exam_points, 0) AS total_points
            FROM
                comentarios AS c
            JOIN aula_virtual AS av ON c.room = av.aula_id
            JOIN usuarios AS u ON c.user_id = u.usuario_id
            JOIN usuarios AS d ON av.usuario_id = d.usuario_id AND d.rol_id = 2 -- Filtrar por rol_id=2
            LEFT JOIN tareas_points AS tp ON tp.user_id = u.usuario_id
            LEFT JOIN exam_points AS ep ON ep.user_id = u.usuario_id
            WHERE
                u.rol_id = 1 -- Estudiantes
                AND CONCAT(u.nombre, ' ', u.apellido) = ?
                AND CONCAT(d.nombre, ' ', d.apellido) = ?
                AND av.aula_id = ?`

  try {
    getConnection().query(query, [ne, `${nombre} ${apellido}`, id_aula], (err, rows) => {
      console.log(err)
      if (rows.length === 0) {
        return res.status(404).json({ error: 'No se encontraron datos para el reporte.' })
      }

      // Generar PDF
      const doc = new PDFDocument({
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      })
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', 'attachment; filename=reporte.pdf')
      doc.pipe(res)

      // Encabezado
      doc.rect(0, 0, 612, 70).fill('#00bcd4') // Fondo cyan
      doc.fillColor('white').fontSize(20).text('Reporte de Aula Virtual', { align: 'center', valign: 'center' })
      doc.moveDown(0.5).fontSize(12).text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, { align: 'center' })

      // Información general
      doc.moveDown(2).fillColor('black').fontSize(12)
      rows.forEach((row, index) => {
        if (index > 0) {
          doc.addPage() // Nueva página por cada registro para mejor lectura
        }

        // Detalles del Aula
        doc
          .fontSize(16).fillColor('#00bcd4').text('Información General:', { underline: true })
          .moveDown(0.5)
          .fontSize(12).fillColor('black')
          .text(`Aula: ${row.nombre_aula}`, { indent: 20 })
          .text(`Profesor: ${row.profesor}`, { indent: 20 })
          .text(`Estudiante: ${row.estudiante}`, { indent: 20 })
          .text(`Fecha del Reporte: ${row.fecha_actual}`, { indent: 20 })
          .moveDown()

        // Puntos
        doc
          .fontSize(16).fillColor('#00bcd4').text('Puntajes: ', { underline: true })
          .moveDown(0.5)
          .fontSize(12).fillColor('black')
          .text(`Puntos obtenidos en Tareas: ${row.tareas_points}`, { indent: 20 })
          .text(`Puntos obtenidos en Exámenes: ${row.exam_points}`, { indent: 20 })
          .text(`Puntos Totales: ${row.total_points}`, { indent: 20 })
          .moveDown()

        // Comentarios
        doc
          .fontSize(16).fillColor('#00bcd4').text('Comentarios:', { underline: true })
          .moveDown(0.5)
          .fontSize(12).fillColor('black')
          .text(row.comentario || 'Sin comentarios', { indent: 20 })
          .moveDown(2)

        // Separador decorativo
        doc.rect(50, doc.y, 500, 1).fill('#00bcd4')
      })

      doc.end()
    })
  } catch (err) {
    console.log(err.message)
    return res.status(500).json({ error: 'Error interno del servidor.' })
  }
}

async function addCommentController (req, res) {
  try {
    const { user_id, room } = req.params

    // Combina los parámetros de la URL con el cuerpo de la solicitud
    const data = {
      ...req.body, // los datos del cuerpo de la solicitud
      user_id, // agrega el user_id desde la URL
      room // agrega el room desde la URL
    }

    // console.log(data)
    // return res.status(200).json({})

    // Llama al controlador para guardar el comentario
    const result = await saveComment(data)

    // Responde según el resultado
    return responses.success(req, res, { com_id: result.insertId, user_id: Number(user_id), room: Number(room), ...req.body })
  } catch (error) {
    console.error('Error al procesar la solicitud:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    })
  }
}

async function updateCommentController (req, res) {
  try {
    const { userId } = req.params

    // Combina los parámetros de la URL con el cuerpo de la solicitud
    const data = {
      ...req.body, // los datos del cuerpo de la solicitud
      userId
    }

    // Llama al controlador para actualizar el comentario
    const result = await updateComment(data)

    // Responde según el resultado
    return responses.success(req, res, { message: 'success', result }, 200)
  } catch (error) {
    console.error('Error al procesar la solicitud:', error.message)
    return responses.success(req, res, { message: 'Error interno del servidor' }, 404)
  }
}

async function getUserComment (req, res) {
  const { userId } = req.params

  try {
    const comments = await select(tables.COMMENTS, { user_id: userId })

    return responses.success(req, res, comments, 200)
  } catch (error) {
    return responses.error(req, res, { message: 'error al obtener comentarios' }, 500)
  }
}
module.exports = { getUserComment, generateReport, addCommentController, updateCommentController }
*/
const PDFDocument = require('pdfkit');
const { getConnection, select } = require('../../../DB/crud');
const { saveComment, updateComment } = require('./comentario');
const responses = require('../../../red/responses');
const tables = require('../../../utils/tables');

/**
 * Genera un reporte en formato PDF basado en el aula virtual y el estudiante.
 */
async function generateReport(req, res) {
  const { nombre, apellido } = req.user; // Usuario autenticado
  const { ne, id_aula } = req.query;

  if (!ne || !id_aula) {
    return res.status(400).json({ error: 'Faltan parámetros necesarios: ne, id_aula' });
  }

  const query = `
    WITH
      tareas_points AS (
        SELECT user_id, SUM(points) AS total_tareas_points
        FROM tareas_content
        GROUP BY user_id
      ),
      exam_points AS (
        SELECT user_id, SUM(points) AS total_exam_points
        FROM exams_users
        GROUP BY user_id
      )
    SELECT
      av.nombre_aula,
      CONCAT(u.nombre, ' ', u.apellido) AS estudiante,
      CONCAT(d.nombre, ' ', d.apellido) AS profesor,
      IFNULL(c.comentario, 'Sin comentarios') AS comentario,
      DATE_FORMAT(NOW(), '%d/%m/%Y') AS fecha_actual,
      COALESCE(tp.total_tareas_points, 0) AS tareas_points,
      COALESCE(ep.total_exam_points, 0) AS exam_points,
      COALESCE(tp.total_tareas_points, 0) + COALESCE(ep.total_exam_points, 0) AS total_points
    FROM
      usuarios AS u
    JOIN aula_virtual AS av ON av.aula_id = ?
    LEFT JOIN comentarios AS c ON c.user_id = u.usuario_id AND c.room = av.aula_id
    JOIN usuarios AS d ON av.usuario_id = d.usuario_id AND d.rol_id = 2
    LEFT JOIN tareas_points AS tp ON tp.user_id = u.usuario_id
    LEFT JOIN exam_points AS ep ON ep.user_id = u.usuario_id
    WHERE
      u.rol_id = 1
      AND CONCAT(u.nombre, ' ', u.apellido) = ?
      AND CONCAT(d.nombre, ' ', d.apellido) = ?;
  `;

  try {
    getConnection().query(query, [id_aula, ne, `${nombre} ${apellido}`], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al ejecutar la consulta.' });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: 'No se encontraron datos para el reporte.' });
      }

      // Generar el PDF
      const doc = new PDFDocument({ margins: { top: 50, bottom: 50, left: 50, right: 50 } });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte.pdf');
      doc.pipe(res);

      // Encabezado del PDF
      doc.rect(0, 0, 612, 70).fill('#00bcd4');
      doc.fillColor('white').fontSize(20).text('Reporte de Aula Virtual', { align: 'center', valign: 'center' });
      doc.moveDown(0.5).fontSize(12).text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, { align: 'center' });

      // Contenido del PDF
      rows.forEach((row, index) => {
        if (index > 0) doc.addPage();

        doc.fontSize(16).fillColor('#00bcd4').text('Información General:', { underline: true }).moveDown(0.5);
        doc.fontSize(12).fillColor('black')
          .text(`Aula: ${row.nombre_aula}`, { indent: 20 })
          .text(`Profesor: ${row.profesor}`, { indent: 20 })
          .text(`Estudiante: ${row.estudiante}`, { indent: 20 })
          .text(`Fecha del Reporte: ${row.fecha_actual}`, { indent: 20 })
          .moveDown();

        doc.fontSize(16).fillColor('#00bcd4').text('Puntajes:', { underline: true }).moveDown(0.5);
        doc.fontSize(12).fillColor('black')
          .text(`Puntos obtenidos en Tareas: ${row.tareas_points}`, { indent: 20 })
          .text(`Puntos obtenidos en Exámenes: ${row.exam_points}`, { indent: 20 })
          .text(`Puntos Totales: ${row.total_points}`, { indent: 20 })
          .moveDown();

        doc.fontSize(16).fillColor('#00bcd4').text('Comentarios:', { underline: true }).moveDown(0.5);
        doc.fontSize(12).fillColor('black')
          .text(row.comentario || 'Sin comentarios', { indent: 20 })
          .moveDown(2);

        doc.rect(50, doc.y, 500, 1).fill('#00bcd4');
      });

      doc.end();
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

/**
 * Controlador para agregar un comentario.
 */
async function addCommentController(req, res) {
  try {
    const { user_id, room } = req.params;
    const data = { ...req.body, user_id, room };

    const result = await saveComment(data);
    return responses.success(req, res, {
      com_id: result.insertId,
      user_id: Number(user_id),
      room: Number(room),
      ...req.body
    });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error.message);
    return responses.error(req, res, { message: 'Error interno del servidor', error: error.message });
  }
}

/**
 * Controlador para actualizar un comentario.
 */
async function updateCommentController(req, res) {
  try {
    const { userId } = req.params;
    const data = { ...req.body, userId };

    const result = await updateComment(data);
    return responses.success(req, res, { message: 'Comentario actualizado exitosamente.', result }, 200);
  } catch (error) {
    console.error('Error al procesar la solicitud:', error.message);
    return responses.error(req, res, { message: 'Error interno del servidor' }, 500);
  }
}

/**
 * Obtiene los comentarios de un usuario.
 */
async function getUserComment(req, res) {
  const { userId } = req.params;

  try {
    const comments = await select(tables.COMMENTS, { user_id: userId });
    return responses.success(req, res, comments, 200);
  } catch (error) {
    console.error('Error al obtener comentarios:', error.message);
    return responses.error(req, res, { message: 'Error interno del servidor' }, 500);
  }
}

module.exports = {
  generateReport,
  addCommentController,
  updateCommentController,
  getUserComment
};
