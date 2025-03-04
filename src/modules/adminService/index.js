
const express = require('express')
const router = express.Router()
const aulasRev = require('./aulasRev') 
const usuariosRev = require('./usuariosRev') 

// Ruta para obtener todas las aulas
router.get('/aulas', (req, res) => {
  aulasRev.getAllAulas((err, aulas) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener las aulas' })
    }
    res.json(aulas)
  })
})

// Ruta para obtener un aula por ID
router.get('/aulas/:id', (req, res) => {
  const aulaId = req.params.id
  aulasRev.getAulaById(aulaId, (err, aula) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener el aula' })
    }
    if (!aula) {
      return res.status(404).json({ error: 'Aula no encontrada' })
    }
    res.json(aula)
  })
})

// Ruta para obtener todos los usuarios (nombre, apellido, correo, rol y estado)
router.get('/usuarios-all', (req, res) => {
  usuariosRev.getAllUsuarios((err, usuarios) => {
    if (err) {
      console.error('Error en la consulta de usuarios:', err) // Log del error en el backend
      return res.status(500).json({ error: 'Error al obtener los usuarios', message: err.message })
    }

    if (usuarios.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios' }) // Si no hay usuarios
    }

    res.json({ message: 'Usuarios obtenidos con éxito', data: usuarios }) // Devuelve los usuarios si todo salió bien
  })
})

// Ruta para obtener un usuario por ID , para obtener todos los datos visibles.(nombre, apellido, correo, rol y estado) pero por id.
router.get('/usuarios/:id', async (req, res) => {
  const usuarioId = req.params.id

  // 1️⃣ Validar que el ID sea numérico
  if (!/^\d+$/.test(usuarioId)) {
    console.warn(`⚠️ El ID proporcionado no es válido: ${usuarioId}`)
    return res.status(400).json({ error: 'El ID de usuario debe ser un número válido' })
  }

  try {
    // 2️⃣ Verificar si la función getUsuarioById está definida
    if (typeof usuariosRev.getUsuarioById !== 'function') {
      console.error('❌ La función getUsuarioById no está definida en usuariosRev')
      return res.status(500).json({ error: 'Error interno del servidor' })
    }

    // 3️⃣ Llamar a la función getUsuarioById
    usuariosRev.getUsuarioById(usuarioId, (err, usuario) => {
      if (err) {
        console.error('❌ Error al obtener el usuario:', err)
        return res.status(500).json({ error: 'Error al obtener el usuario' })
      }

      if (!usuario) {
        console.warn(`⚠️ Usuario con ID ${usuarioId} no encontrado`)
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }

      console.log('✅ Usuario encontrado:', usuario)
      res.json(usuario)
    })
  } catch (error) {
    console.error('❌ Error inesperado en la ruta /usuarios/:id:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Ruta para actualizar un usuario
router.patch('/update-usuario/:id', (req, res) => {
  const usuarioId = req.params.id // Obtener el ID del usuario desde los parámetros de la URL
  const { nombre, apellido, correo, rol_id, estado } = req.body // Obtener los campos del cuerpo de la solicitud

  // Verificar que el usuarioId esté presente y sea válido
  if (!usuarioId || isNaN(usuarioId)) {
    return res.status(400).json({ error: 'El ID de usuario es inválido o no se proporcionó' })
  }

  // Verificar que al menos un campo a actualizar esté presente
  if (!nombre && !apellido && !correo && !rol_id && !estado) {
    return res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar' })
  }

  // Llamar al método de actualización pasando los campos a actualizar
  usuariosRev.updateUsuario(usuarioId, nombre, apellido, correo, rol_id, estado, (err, results) => {
    if (err) {
      console.error('Error al actualizar el usuario:', err) // Log del error
      return res.status(500).json({ error: 'Error al actualizar el usuario', message: err.message })
    }

    // Verificar si se realizaron cambios
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado o no se realizaron cambios' })
    }

    res.json({ message: 'Usuario actualizado con éxito', data: results })
  })
})

// Ruta para actualizar un aula
router.put('/update-aula-gen', (req, res) => {
  const { aulaId, nombre_aula, aula_descripcion } = req.body
  aulasRev.updateAula(aulaId, nombre_aula, aula_descripcion, (err, results) => {
    if (err) {
      return res.status(500).send({ error: true, message: err.message })
    }
    res.send({ success: true, message: 'Aula actualizada con éxito', data: results })
  })
})

router.put('/update/nombre', (req, res) => {
  const { aulaId, nombre_aula } = req.body
  aulas.updateNombreAula(aulaId, nombre_aula, (err, results) => {
    if (err) {
      return res.status(500).send({ error: true, message: err.message })
    }
    res.send({ success: true, message: 'Nombre del aula actualizado con éxito', data: results })
  })
})

router.put('/update/descripcion', (req, res) => {
  const { aulaId, aula_descripcion } = req.body
  aulas.updateDescripcionAula(aulaId, aula_descripcion, (err, results) => {
    if (err) {
      return res.status(500).send({ error: true, message: err.message })
    }
    res.send({ success: true, message: 'Descripción del aula actualizada con éxito', data: results })
  })
})

// Ruta para eliminar un aula
router.delete('/delete/:aulaId', (req, res) => {
  const { aulaId } = req.params
  aulasRev.deleteAula(aulaId, (err, results) => {
    if (err) {
      return res.status(500).send({ error: true, message: err.message })
    }
    res.send({ success: true, message: 'Aula eliminada con éxito', data: results })
  })
})

module.exports = router
