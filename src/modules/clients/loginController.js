const db = require('./../../DB/crud')
const auth = require('../../auth')
const TABLE = 'usuarios'

// A library to help you hash passwords url: https://www.npmjs.com/package/bcrypt
const bcryp = require('bcrypt')

const login = async (body) => {
  // detectar si el usuario existe!
  const data = await db.selectOneWhere(TABLE, { correo: body.email })

  // si no existe
  if (!data) {
    return
  }

  // si existe
  return bcryp.compare(body.password, data.contrasenia).then(result => {
    // obtener usuario o datos del usuario desde la db en el result
    // si la contraseña corresponde
    if (result) {
      const user = {
        id: data.usuario_id,
        name: data.nombre,
        lastName: data.apellido,
        email: data.correo,
        type: data.rol_id,
        pic: data.userimage,
        bg: data.userbackground,
        state: data.estado
      }

      // se asigna el token al usuario
      return { ...user, token: auth.assignToken({ ...data }) }
    } else {
      // sino envía un error
      return { error: 'invalid password' }
    }
  })
}

module.exports = {
  login
}
