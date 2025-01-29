/* eslint-disable no-throw-literal */
/* eslint-disable camelcase */
const express = require('express')
const { uploadController, addVerificationImg, inVerification } = require('./teacher.controller')
const router = express.Router()
const security = require('../../middlewares/security')
const responses = require('../../red/responses')

router.post('/', uploadController.single('file'), security(), async (req, res) => {
  try {
    const { filename } = req.file
    const { type } = req.body
    const { usuario_id } = req.user

    const verification = await addVerificationImg({ type, url: `uploads/${filename}`, userId: usuario_id })

    if (verification.error) {
      throw new Error(verification.message)
    }

    return res.json({ message: 'agregado correctamente', file: `uploads/${filename}`, upload: true })
  } catch (err) {
    return res.json({ message: err.message, upload: false })
  }
})

router.get('/check', security(), async (req, res) => {
  const verification = await inVerification(req.user.usuario_id)

  return responses.success(req, res, { verification }, 200)
})

module.exports = router
