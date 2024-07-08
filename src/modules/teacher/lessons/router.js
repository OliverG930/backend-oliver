const express = require('express')
const router = express.Router()
const security = require("../../../middlewares/security")
const IsTeacher = require("../../../middlewares/teacher")
const responses = require('../../../red/responses')
const controller = require('./controller')
const messages = require('../../../utils/messages')

router.get('/all/:room', security(), IsTeacher(), async (req, res) => {
    const room = req.params.room

    await controller.all(room)
        .then(result => {
            responses.success(req, res, { message: messages.info_messages.ALL_LESSONS, result }, 200)
        }).catch((e) => {
            responses.error(req, res, { message: e.message, e }, 200)
        })
})

router.get('/:lesson', security(), IsTeacher(), async (req, res) => {
    const lesson = req.params.lesson

    await controller.get(lesson).then(result => {
        responses.success(req, res, { result }, 200)
    }).catch((e) => {
        responses.error(req, res, { message: e.message }, 500)
    })
})

router.post("/create/:room", security(), IsTeacher(), async (req, res) => {
    const teacher = req.user
    const room = req.params.room

    await controller.create(room, teacher.usuario_id)
        .then(result => {
            responses.success(req, res, { message: messages.info_messages.LESSON_CREATED, result }, 200)
        })
        .catch((e) => {
            responses.error(req, res, { message: messages.err_messages.CANT_INSERT }, 500)
        })
})

router.post("/update/:lesson", security(), IsTeacher(), async (req, res) => {
    const lesson = req.params.lesson

    const { body } = req

    const data = {
        title: body?.title,
        desc: body?.desc
    }

    await controller.update(lesson, data)
        .then(data => {
            return responses.success(req, res, { message: messages.info_messages.LESSON_UPDATED, data }, 200)
        })
        .catch((e) => {
            responses.error(req, res, { message: e.sqlMessage, }, 500)
        })

})


router.post("/delete/:lesson", security(), IsTeacher(), async (req, res) => {
    const { lesson } = req.params

    await controller.remove(lesson)
        .then(result => {
            responses.success(req, res, { message: messages.info_messages.LESSON_DELETED, result }, 200)
        }).catch((e) => {
            responses.error(req, res, { message: messages.err_messages.CANT_DELETE }, 500)
        })
})

module.exports = router