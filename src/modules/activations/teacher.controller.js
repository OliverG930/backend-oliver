/* eslint-disable camelcase */
const db = require('../../DB/crud')
const multer = require('multer')
const path = require('path')
const tables = require('../../utils/tables')
const fs = require('fs')

// Configuración de multer
const storage = multer.diskStorage({
  destination: path.resolve(process.cwd(), 'src/public/uploads'),
  filename: (_, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`
    cb(null, uniqueSuffix)
  }
})

const uploadController = multer({ storage })

const addVerificationImg = async ({ type, url, userId }) => {
  const verification = await inVerification(userId)

  if (type === '1') {
    if (verification) {
      if (verification.img_1 !== null) {
        removeFile(url)
        return { error: true, message: 'Ya se encuentra en proceso' }
      } else {
        return await db.update(tables.VERIFICATIONS, { img_1: url }, { usuario_id: userId })
      }
    }

    return await db.insert(tables.VERIFICATIONS, { usuario_id: userId, img_1: url })
  } else if (type === '2') {
    if (verification.img_2 !== null) {
      removeFile(url)
      return { error: true, message: '2 Ya se encuentra en proceso' }
    }

    return await db.update(tables.VERIFICATIONS, { img_2: url }, { usuario_id: userId })
  }
}

const inVerification = async (usuario_id) => {
  return await db.selectOneWhere(tables.VERIFICATIONS, { usuario_id })
}

const removeFile = (filename) => {
  const pathToFile = path.resolve(process.cwd(), `src/public/${filename}`)

  fs.unlink(pathToFile, function (err) {
    if (err) {
      throw err
    } else {
      // console.log('Successfully deleted the file.')
    }
  })
}

module.exports = {
  uploadController,
  inVerification,
  addVerificationImg
}
