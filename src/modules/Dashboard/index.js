const express = require('express')
const router = express.Router()
const responses = require('../../red/responses')

const rooms = require("./Rooms/router")
const courses = require("./Courses/router")
const chatbot = require("./Chatbot/Router")

router.get("/", async (req, res, next) => {
    return responses.success(req, res, { message: "hello!" }, 200)
})

router.use("/rooms", rooms)
router.use("/courses", courses)
router.use("/chatbot", chatbot)

module.exports = router