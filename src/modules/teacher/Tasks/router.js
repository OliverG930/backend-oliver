const express = require("express")
const router = express.Router()
const responses = require('../../../red/responses')
const controller = require("./controller")

router.get("/:id", async (request, response) => {
    responses.success(request, response, { message: "hello" }, 200)
})

router.get("/add/:id", async (request, response) => {

    const { id } = request.params

    const { insertId } = await controller.addNewTask(id)

    responses.success(request, response, { message: "hello", insertId }, 200)
})

router.post("/add/:id", async (request, response) => {
    const { id } = request.params
    const { insertId } = await controller.addNewTask(id)
    responses.success(request, response, { insertId }, 200)
})

module.exports = router