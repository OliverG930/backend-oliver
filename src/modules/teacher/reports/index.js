const express = require('express')
const router = express.Router()
const responses = require('../../../red/responses')
const security = require('../../../middlewares/security')

router.get("/", security(), (req, res) => {
    return responses.success(req, res, { message: "success" }, 200)
})

module.exports = router