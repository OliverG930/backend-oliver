const PDFDocument = require('pdfkit');
const mysql = require('mysql2/promise');

async function generateReport(req, res) {
    const { ne, PRN, id_aula } = req.query;

    if (!ne || !PRN || !id_aula) {
        return res.status(400).json({ error: "Faltan parámetros necesarios: ne, PRN, id_aula" });
    }

    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'tcc',
    });

    try {
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
                AND av.aula_id = ?`;

        const [rows] = await connection.execute(query, [ne, PRN, id_aula]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "No se encontraron datos para el reporte." });
        }

        // Generar PDF
        const doc = new PDFDocument({
            margins: { top: 50, bottom: 50, left: 50, right: 50 }
        });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=reporte.pdf`);
        doc.pipe(res);

        // Encabezado
        doc.rect(0, 0, 612, 70).fill('#00bcd4'); // Fondo cyan
        doc.fillColor('white').fontSize(20).text('Reporte de Aula Virtual', { align: 'center', valign: 'center' });
        doc.moveDown(0.5).fontSize(12).text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, { align: 'center' });

        // Información general
        doc.moveDown(2).fillColor('black').fontSize(12);
        rows.forEach((row, index) => {
            if (index > 0) {
                doc.addPage(); // Nueva página por cada registro para mejor lectura
            }

            // Detalles del Aula
            doc
                .fontSize(16).fillColor('#00bcd4').text(`Información General:`, { underline: true })
                .moveDown(0.5)
                .fontSize(12).fillColor('black')
                .text(`Aula: ${row.nombre_aula}`, { indent: 20 })
                .text(`Profesor: ${row.profesor}`, { indent: 20 })
                .text(`Estudiante: ${row.estudiante}`, { indent: 20 })
                .text(`Fecha del Reporte: ${row.fecha_actual}`, { indent: 20 })
                .moveDown();

            // Puntos
            doc
                .fontSize(16).fillColor('#00bcd4').text(`Puntajes: `, { underline: true })
                .moveDown(0.5)
                .fontSize(12).fillColor('black')
                .text(`Puntos obtenidos en Tareas: ${row.tareas_points}`, { indent: 20 })
                .text(`Puntos obtenidos en Exámenes: ${row.exam_points}`, { indent: 20 })
                .text(`Puntos Totales: ${row.total_points}`, { indent: 20 })
                .moveDown();

            // Comentarios
            doc
                .fontSize(16).fillColor('#00bcd4').text(`Comentarios:`, { underline: true })
                .moveDown(0.5)
                .fontSize(12).fillColor('black')
                .text(row.comentario || 'Sin comentarios', { indent: 20 })
                .moveDown(2);

            // Separador decorativo
            doc.rect(50, doc.y, 500, 1).fill('#00bcd4');
        });

        doc.end();
    } catch (error) {
        console.error('Error al generar el reporte:', error);
        return res.status(500).json({ error: "Error interno del servidor." });
    } finally {
        await connection.end();
    }
}

module.exports = { generateReport };
