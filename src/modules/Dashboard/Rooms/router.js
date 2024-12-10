const express = require('express')
const router = express.Router()
const responses = require('../../../red/responses')
const { saveCompletedTask, getCompletedTasks, deleteTask, createTask, getTasks, getContents, getMyExams, getLessonContent, getCourses, getCourse, getAllCourses, enrollCourse, enroll, unroll, getLessons, getRoomLessons, getExams } = require('./controller')

const security = require('../../../middlewares/security')

// router.get("/:id:", security(), getAll) // obsoleto cambiar en front antes de borrar

router.get('/', security(), getAllCourses)

router.get('/courses', security(), getCourses)
router.get('/courses/:id', security(), getCourse)
router.get('/courses/enroll/:id', security(), enrollCourse)
router.get('/courses/:id/lessons', security(), getLessons)
router.get('/courses/lessons/:id/contents', security(), getContents)

router.get('/lessons/:id', security(), getLessonContent)

router.get('/:roomId/myExams', security(), getMyExams)
router.get('/:roomId/tasks', security(), getTasks)
router.post('/:roomId/tasks', security(), createTask)

router.delete('/tasks/:taskId', security(), deleteTask)
router.get('/tasks/:taskId/completed', security(), getCompletedTasks)
router.post('/tasks/:taskId/completed', security(), saveCompletedTask)
// antiguos
router.get('/enrolled', security(), async (req, res, next) => {
  const { user } = req

  responses.success(req, res, { message: 'Hola ', user }, 200)
})

router.post('/enroll', security(), async (req, res, next) => {
  const insert = enroll(req.body)

  insert.then(response => {
    if (response.exists) {
      responses.error(req, res, { message: response.message }, 500)
    } else {
      responses.success(req, res, { response }, 200)
    }
  })
})

router.post('/unroll/:id', security(), async (req, res, next) => {
  const { id } = req.params

  const insert = unroll(id)

  insert.then(response => {
    if (response.exists) {
      responses.error(req, res, { message: response.message }, 500)
    } else {
      responses.success(req, res, { response }, 200)
    }
  })
})

router.get('/:id/lessons', async (req, res) => {
  const { id } = req.params
  const result = await getRoomLessons(id)
  responses.success(req, res, { message: id, result }, 200)
})

router.get('/lessons/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await getLessons(id)
    return responses.success(req, res, { message: id, result }, 200)
  } catch (e) {
    console.error(e.message)
    return responses.error(req, res, { message: e.message }, 500)
  }
})

router.get('/:id/exams', security(), async (req, res) => {
  const { params } = req
  const id = params.id

  const examsResult = await getExams(id)

  responses.success(req, res, { message: 'hello', exams: examsResult }, 200)
})

module.exports = router
