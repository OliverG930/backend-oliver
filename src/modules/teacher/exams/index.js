/* eslint-disable space-before-function-paren */
const express = require('express')
const router = express.Router()
const responses = require('../../../red/responses')
const security = require('../../../middlewares/security')
const { insert, select, deleteWhereID, update } = require('../../../DB/crud')
const tables = require('../../../utils/tables')

function getExams(roomID) {
  return select(tables.EXAMS, { roomID })
}

router.get('/:roomID', security(), async (req, res) => {
  const roomID = req.params.roomID

  const exams = await getExams(roomID)

  return responses.success(req, res, { message: 'success', exams }, 200)
})

function calculateTimestamp(days) {
  if (isNaN(days) || days <= 0) {
    throw new Error('El número de días debe ser un entero positivo.')
  }

  const now = new Date() // Fecha actual
  const nowTimestamp = Math.floor(now.getTime() / 1000) // Timestamp actual

  const futureDate = new Date()
  futureDate.setDate(now.getDate() + days) // Agrega los días
  const futureTimestamp = Math.floor(futureDate.getTime() / 1000) // Timestamp futuro

  return {
    start: nowTimestamp,
    end: futureTimestamp
  }
}

const saveExam = ({ exam, config, roomID, expires_at }) => insert(tables.EXAMS, { exam, config, roomID, expires_at })

router.post('/save', security(), async (req, res) => {
  try {
    const { body } = req

    const exam = body.exam
    const config = body.config
    const roomID = body.roomID
    const days = JSON.parse(config).days

    const date = new Date(calculateTimestamp(Number(days)).end * 1000)
    const expires_at = date.toISOString().slice(0, 19).replace('T', ' ')

    const save = await saveExam({ exam, config, roomID, expires_at })
    return responses.success(req, res, { message: 'success', save }, 200)
  } catch (e) {
    console.error(e.message)
    return responses.error(req, res, { message: e.message }, 200)
  }
})

function deleteExam(examID) {
  return deleteWhereID(tables.EXAMS, { id: examID })
}

router.post('/delete', security(), async (req, res) => {
  const { body } = req

  try {
    const result = await deleteExam(body.examID)
    return responses.success(req, res, { result }, 200)
  } catch (error) {
    return responses.success(req, res, { message: error.message }, 404)
  }
})

router.put('/update', security(), async (req, res) => {
  const { body } = req

  const data = {
    exam: JSON.stringify(body.exam),
    config: JSON.stringify(body.config)
  }
  await update(tables.EXAMS, data, { id: Number(body.id) })

  return responses.success(req, res, { message: 'update' }, 200)
})

router.put('/post', security(), async (req, res) => {
  const { body } = req

  const data = {
    published: 1
  }
  await update(tables.EXAMS, data, { id: Number(body.id) })

  return responses.success(req, res, { message: 'update' }, 200)
})

module.exports = router
