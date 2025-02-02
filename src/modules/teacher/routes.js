const express = require('express')
const router = express.Router()
const roomsRouter = require('./routes/rooms')
const lessons = require('./lessons/router')
const contents = require('./lessons/contents/router')
const tasksRouter = require('./Tasks/router')
const reportsRouter = require('./reports/index')
const examsRouter = require('./exams')
const filesRouter = require('../teacher/files')
const security = require('../../middlewares/security')
const responses = require('../../red/responses')

router.get('/', security(), async (req, res, next) => {
  return responses.success(req, res, { message: 'hello Teacher!' }, 200)
})

router.use(roomsRouter)
router.use('/lessons', lessons)
router.use('/lessons/contents/', contents)
router.use('/tasks', tasksRouter)
router.use('/reports', reportsRouter)
router.use('/exams', examsRouter)
router.use('/files', filesRouter)

module.exports = router
