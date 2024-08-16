const express = require("express")
const router = express.Router()
const responses = require("../../../red/responses")
const controller = require("./controller")

const security = require("../../../middlewares/security")

router.get("/", async (req, res, next) => {

    try {
        const rooms = await controller.all()
        responses.success(req, res, { message: "hola", rooms }, 200)

    } catch (e) {
        console.log(e.message)
    }
})

router.get("/:id", async (req, res, next) => {

    const { id } = req.params

    const data = await controller.get(id)
    responses.success(req, res, { data }, 200)

})

router.get("/enrolled", security(), async (req, res, next) => {

    const { user } = req


    responses.success(req, res, { message: `Hola `, user }, 200)
})

router.post("/enroll", security(), async (req, res, next) => {

    const insert = controller.enroll(req.body)

    insert.then(response => {
        if (response.exists) {
            responses.error(req, res, { message: response.message }, 500)
        } else {
            responses.success(req, res, { response }, 200)
        }
    })
})


router.post("/unroll/:id", security(), async (req, res, next) => {

    const { id } = req.params

    const insert = controller.unroll(id)

    insert.then(response => {
        if (response.exists) {
            responses.error(req, res, { message: response.message }, 500)
        } else {
            responses.success(req, res, { response }, 200)
        }
    })
})


router.get("/:id/lessons", async (req, res) => {
    const { id } = req.params
    const result = await controller.getRoomLessons(id)
    responses.success(req, res, { message: id, result }, 200)
})

router.get("/lessons/:id", async (req, res) => {
    const { id } = req.params
    const result = await controller.getLessons(id)
    responses.success(req, res, { message: id, result }, 200)
})

module.exports = router