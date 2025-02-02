const express = require('express')
const router = express.Router()
const { deleteFile } = require('./controller')

router.delete('/:file', deleteFile)

module.exports = router
