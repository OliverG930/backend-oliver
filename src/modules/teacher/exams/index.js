const express = require('express')
const router = express.Router()
const responses = require('../../../red/responses')
const security = require('../../../middlewares/security')
const { insert } = require('../../../DB/crud')
const tables = require('../../../utils/tables')

router.get("/", security(), (req, res) => {
    return responses.success(req, res, { message: "success" }, 200)
})

const saveExam = ({ exam, config, roomID }) => insert(tables.EXAMS, { exam, config, roomID })

router.post("/save", security(), async (req, res) => {

    const { body } = req;

    const exam = body.exam;
    const config = body.config;
    const roomID = body.roomID;
    const save = await saveExam({ exam, config, roomID });
    return responses.success(req, res, { message: "success", save }, 200)
})

module.exports = router