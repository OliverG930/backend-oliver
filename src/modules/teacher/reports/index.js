/* eslint-disable camelcase */
const express = require('express')
const router = express.Router()
const security = require('../../../middlewares/security')
const { generateReport, addCommentController, updateCommentController, getUserComment } = require('./reports')
const { isTeacher } = require('../isTeacher')
const { selectAlumno } = require('./comentario')

// borrar luego
const { deleteWhereID } = require('../../../DB/crud')
const tables = require('../../../utils/tables')
const responses = require('../../../red/responses')

// Nueva ruta para el reporte
router.get('/reporte', security(), generateReport)
// Ruta para guardar un nuevo comentario (POST)
router.post('/comentario/:user_id/:room', security(), addCommentController)
// Ruta para actualizar un comentario existente (PATCH)
router.patch('/comentario/:userId', security(), updateCommentController)
// Ruta obtener comentarios del estudiante
router.get('/comentario/:userId', security(), isTeacher(), getUserComment)
// Ruta borrar comentario
router.delete('/comentario/:commentId', security(), isTeacher(), (req, res) => {
  const { commentId } = req.params

  try {
    const deleteComment = deleteWhereID(tables.COMMENTS, { com_id: commentId })
    return responses.success(req, res, deleteComment, 200)
  } catch (error) {
    return responses.error(req, res, { message: 'error al borrar comentario' }, 500)
  }
})

router.get('/getalumno/:nombre/:apellido/:aula_id', selectAlumno)

module.exports = router
