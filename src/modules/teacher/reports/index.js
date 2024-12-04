const express = require('express')
const router = express.Router()
const responses = require('../../../red/responses')
const security = require('../../../middlewares/security')
const { generateReport } = require('./reports')
router.get('/', security(), (req, res) => {
  return responses.success(req, res, { message: 'success' }, 200)
})

// Nueva ruta para el reporte
router.get('/reporte', security(), generateReport)

module.exports = router
