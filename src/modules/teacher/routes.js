const express = require('express')
const router = express.Router()
const rooms_router = require("./routes/rooms")
const lessons_router = require("./routes/lessons")

router.use(rooms_router)
router.use("/lessons", lessons_router)

module.exports = router