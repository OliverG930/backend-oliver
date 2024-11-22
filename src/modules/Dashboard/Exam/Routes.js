const express = require("express")
const router = express.Router()
const security = require("../../../middlewares/security")
const responses = require("../../../red/responses")

router.get("/", (req, res) => {
  return responses.success(req, res, { message: 'hola' }, 200)
})

module.exports = router