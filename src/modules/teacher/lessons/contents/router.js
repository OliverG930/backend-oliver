const express = require('express')
const router = express.Router()
const messages = require('../../../../utils/messages')
const controller = require("./controller")
const security = require('../../../../middlewares/security')
const IsTeacher = require("../../../../middlewares/teacher")
const responses = require('../../../../red/responses')

router.get('/all/:lesson', security(), IsTeacher(), async (req, res) => {
    const lesson = req.params.lesson

    await controller.all(lesson)
        .then(result => {
            responses.success(req, res, { message: messages.info_messages.ALL_LESSONS_CONTENTS, result }, 200)
        }).catch((e) => {
            responses.error(req, res, { message: e.message, e }, 200)
        })
})


router.post('/create/:lesson', security(), IsTeacher(), async (req, res) => {

    const { body, params } = req
    const lesson = params.lesson

    const data = {
        lesson_id: lesson,
        type: body?.type,
        value: body?.value
    }

    await controller.create(data)
        .then(result => {
            responses.success(req, res, { message: messages.info_messages.LESSONS_CONTENTS_CREATED, result }, 200)
        }).catch((e) => {
            responses.error(req, res, { message: e.message, e }, 200)
        })
})

router.delete('/delete/:content', security(), IsTeacher(), async (req, res) => {

    const { params } = req
    const content = params.content

    await controller.remove(content)
        .then(result => {
            responses.success(req, res, { message: messages.info_messages.LESSONS_CONTENTS_DELETED, result }, 200)
        }).catch((e) => {
            responses.error(req, res, { message: e.message, e }, 200)
        })
})


module.exports = router