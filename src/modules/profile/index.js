const express = require('express')
const router = express.Router()
const security = require('../../middlewares/security')
const { updateProfileImages, uploadController } = require('./controller')

router.put('/:update', security(),
  uploadController.single('file'),
  updateProfileImages)

module.exports = router
