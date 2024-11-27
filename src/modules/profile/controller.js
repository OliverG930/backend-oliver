/* eslint-disable camelcase */
const db = require('../../DB/crud')
const tables = require('../../utils/tables')
const multer = require('multer')
const path = require('path')
const responses = require('../../red/responses')

// Configuración de multer
const storage = multer.diskStorage({
  destination: path.resolve(process.cwd(), 'src/public/uploads'),
  filename: (_, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname}`
    cb(null, uniqueSuffix)
  }
})

const uploadController = multer({ storage })

async function updateProfileImages (req, res) {
  const { update } = req.params
  const { usuario_id } = req.user
  const { filename } = req.file
  let data = {}

  if (update === 'bg') {
    data = { userbackground: filename }
  }

  if (update === 'pic') {
    data = { userimage: filename }
  }

  console.log(update, usuario_id, filename)
  if (data !== null) {
    try {
      await db.update(tables.USUARIOS, data, { usuario_id })
        .then(response => {
          console.log(response)
          return responses.success(req, res, { message: 'updated', filename }, 200)
        })
    } catch (err) {
      return responses.error(req, res, { message: err.message }, 500)
    }
  } else {
    return responses.error(req, res, { message: 'cant update' }, 404)
  }
}

module.exports = {
  updateProfileImages,
  uploadController
}
