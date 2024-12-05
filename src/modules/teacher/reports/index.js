const express = require('express')
const router = express.Router()
const responses = require('../../../red/responses')
const security = require('../../../middlewares/security')
const { generateReport } = require('./reports')
const { saveComment,updateComment, selectAlumno} = require('./comentario')
router.get('/', security(), (req, res) => {
  return responses.success(req, res, { message: 'success' }, 200)
})

// Nueva ruta para el reporte
router.get('/reporte', security(), generateReport)
// Ruta para guardar un nuevo comentario (POST)
router.post("/comentario/comentario/:user_id/:room",security(), async (req, res) => {
  try {
    const { user_id, room } = req.params;

    // Combina los parámetros de la URL con el cuerpo de la solicitud
    const data = {
      ...req.body,  // los datos del cuerpo de la solicitud
      user_id,      // agrega el user_id desde la URL
      room,         // agrega el room desde la URL
    };

    // Llama al controlador para guardar el comentario
    const result = await saveComment(data);

    // Responde según el resultado
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error al procesar la solicitud:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
});

// Ruta para actualizar un comentario existente (PUT)
router.put("/comentario/:user_id/:room",security(), async (req, res) => {
  try {
    const { user_id, room } = req.params;

    // Combina los parámetros de la URL con el cuerpo de la solicitud
    const data = {
      ...req.body,  // los datos del cuerpo de la solicitud
      user_id,      // agrega el user_id desde la URL
      room,         // agrega el room desde la URL
    };

    // Llama al controlador para actualizar el comentario
    const result = await updateComment(data);

    // Responde según el resultado
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error("Error al procesar la solicitud:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error: error.message,
    });
  }
});

router.get('/getalumno/:nombre/:apellido/:aula_id', selectAlumno);



module.exports = router
