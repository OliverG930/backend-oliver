const express = require('express');
const mysql = require('mysql2/promise');
const router = express.Router(); // Creando el router de Express
// es opcional
// Función que maneja la lógica para obtener aulas y estudiantes
const getAulasAndStudents = async (req, res) => {
    const { id_aula, ne, PRN } = req.query;

    // Valida si al menos uno de los parámetros es proporcionado
    if (!id_aula && !ne && !PRN) {
        return res.status(400).json({ error: "Se debe proporcionar al menos un parámetro de filtro." });
    }

    try {
        // Crear la conexión utilizando mysql2/promise
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'tcc',
        });

        // Query para obtener las aulas y los estudiantes/docentes con filtros opcionales
        let query = `
            SELECT
                av.aula_id,
                av.nombre_aula,
                CONCAT(u.nombre, ' ', u.apellido) AS estudiante,
                CONCAT(d.nombre, ' ', d.apellido) AS docente
            FROM aula_virtual AS av
            JOIN usuarios AS u ON av.usuario_id = u.usuario_id AND u.rol_id = 1 
            LEFT JOIN usuarios AS d ON av.usuario_id = d.usuario_id AND d.rol_id = 2 
            WHERE 1=1
        `;

        // Parámetros de la consulta
        let params = [];

        // Aplica los filtros de acuerdo a los parámetros proporcionados
        if (id_aula) {
            query += ` AND av.aula_id = ?`;
            params.push(id_aula);
        }

        if (ne) {
            query += ` AND CONCAT(u.nombre, ' ', u.apellido) LIKE ?`;
            params.push(`%${ne}%`);
        }

        if (PRN) {
            query += ` AND CONCAT(d.nombre, ' ', d.apellido) LIKE ?`;
            params.push(`%${PRN}%`);
        }

        // Ejecuta la consulta con los parámetros
        const [rows] = await connection.execute(query, params);

        // Si no se encuentran resultados
        if (rows.length === 0) {
            return res.status(404).json({ error: "No se encontraron aulas o estudiantes con los filtros proporcionados." });
        }

        // Devuelve los resultados
        res.status(200).json({ data: rows });

        // Cierra la conexión
        await connection.end();
    } catch (error) {
        console.error("Error al obtener las aulas y estudiantes:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};


module.exports = router;
