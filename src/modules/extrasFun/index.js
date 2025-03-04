const express = require('express')
const router = express.Router()
const controller = require('./controller') // Asegúrate de que la ruta sea correcta


// Obtener los exámenes en curso
router.get('/excurso', async (req, res) => {
    try {
        const { id } = req.query; // Obtener el ID desde los parámetros de consulta
        if (!id) return res.status(400).json({ error: 'ID requerido' });

        const exams = await controller.getExams(id);
        res.json(exams);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los exámenes en curso' });
    }
});

// Obtener la cantidad de aulas
router.get('/countaula', async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: 'ID requerido' });

        const count = await controller.getCountAulas(id);
        res.json({ aulas: count });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la cantidad de aulas' });
    }
});

// Obtener la cantidad de archivos en un aula
router.get('/countfiles', async (req, res) => {
    try {
        const { userId, aulaId } = req.query; // Se extraen los dos parámetros

        if (!userId || !aulaId) {
            return res.status(400).json({ error: 'userId y aulaId son requeridos' });
        }

        const count = await controller.getCountFiles(userId, aulaId); // Llamamos correctamente la función
        res.json({ archivos: count }); // Devuelve la cantidad de archivos
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la cantidad de archivos' });
    }
});

// Obtener la cantidad de archivos en un aula
router.get('/counttareas', async (req, res) => {
    try {
        const { userId, aulaId } = req.query; // Se extraen los dos parámetros

        if (!userId || !aulaId) {
            return res.status(400).json({ error: 'userId y aulaId son requeridos' });
        }

        const count = await controller.getCountTareas(userId, aulaId); // Llamamos correctamente la función
        res.json({ archivos: count }); // Devuelve la cantidad de archivos
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la cantidad de archivos' });
    }
});

// Obtener la cantidad de aulas
router.get('/countalumnos', async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: 'ID requerido' });

        const count = await controller.getCountAlumnos(id);
        res.json({ aulas: count });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la cantidad de aulas' });
    }
});

// Obtener la cantidad de aulas
router.get('/listalumnos', async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) return res.status(400).json({ error: 'ID requerido' });

        const count = await controller.getListaAlumnos(id);
        res.json({ aulas: count });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la cantidad de aulas' });
    }
});



  module.exports = router