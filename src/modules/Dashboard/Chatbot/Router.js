const express = require("express")
const router = express.Router()
const security = require("../../../middlewares/security")
const { sendMessage } = require("./Controller")

router.post("/send-message", security(), sendMessage)

module.exports = router