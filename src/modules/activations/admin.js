/* eslint-disable camelcase */
const express = require('express')
const router = express.Router()
const adminRev = require('./adminRev')

// Obtener todas las verificaciones
router.get('/verifications', (req, res) => {
  adminRev.getAllVerifications((err, verifications) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener las verificaciones' })
    }
    res.json(verifications)
  })
})

// Obtener una verificación específica con imágenes
router.get('/verificationup/:id', async (req, res) => {
  try {
    const veri_id = req.params.id

    if (!veri_id) {
      return res.status(400).json({ error: 'El ID de verificación es requerido' })
    }

    const verificationData = await adminRev.getVerificationWithImages(veri_id)

    if (!verificationData || verificationData.length === 0) {
      return res.status(404).json({ error: 'No se encontraron verificaciones' })
    }

    res.status(200).json(verificationData)
  } catch (error) {
    console.error('Error al obtener verificaciones:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Actualizar el estado y mensaje de una verificación
router.patch('/verificationup/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { state, verified, state_message, estado } = req.body

    // Validar que todos los campos necesarios estén presentes
    if (state === undefined || verified === undefined || state_message === undefined || estado === undefined) {
      return res.status(400).json({ error: 'Estado, verificación y mensaje de estado son requeridos' })
    }

    // Llamar a la función para actualizar el estado, verificación y mensaje
    const result = await adminRev.updateVerificationState(id, state, verified, state_message)

    // Llamar a la función para actualizar el campo estado
    const result2 = await adminRev.updateEstadoVef(id, estado)

    // Verificar si la actualización fue exitosa para ambos casos
    if (result && result2) {
      // Retornar el resultado de la actualización
      return res.status(200).json({ message: 'Verificación actualizada correctamente' })
    } else {
      return res.status(400).json({ error: 'Error al actualizar la verificación' })
    }
  } catch (error) {
    console.error('Error al actualizar la verificación:', error)
    res.status(500).json({ error: error.message || 'Error interno del servidor' })
  }
})

// Eliminar imagen de una verificación
router.patch('/verificationdel/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { imageColumn } = req.body // Obtener el nombre de la columna de la imagen desde el cuerpo

    // Validar que la columna de imagen esté presente y sea válida
    if (!imageColumn || (imageColumn !== 'img_1' && imageColumn !== 'img_2')) {
      return res.status(400).json({ error: 'Columna de imagen no válida. Usa "img_1" o "img_2".' })
    }

    // Llamar a la función para eliminar la imagen
    const result = await adminRev.deleteImage(id, imageColumn)

    // Verificar si la eliminación fue exitosa
    if (result) {
      return res.status(200).json({ message: 'Imagen eliminada correctamente' })
    } else {
      return res.status(400).json({ error: 'Error al eliminar la imagen' })
    }
  } catch (error) {
    console.error('Error al eliminar la imagen:', error)
    res.status(500).json({ error: error.message || 'Error interno del servidor' })
  }
})

module.exports = router
