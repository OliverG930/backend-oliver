/* eslint-disable space-before-function-paren */
/* eslint-disable camelcase */
const db = require('../../../DB/crud')
const TABLES = require('../../../utils/tables')
const responses = require('../../../red/responses')
const tables = require('../../../utils/tables')

async function getAllCourses(req, res) {
  try {
    const rooms = await db.get(TABLES.AULA_VIRTUAL)
    return responses.success(req, res, { rooms }, 200)
  } catch (e) {
    console.log(e.message)
    return responses.error(req, res, { message: e.message }, 500)
  }
}

async function getAll(req, res) {
  const { id } = req.params

  const data = await get(id)
  responses.success(req, res, { courses: data }, 200)
}

async function getCourses(req, res) {
  try {
    const { usuario_id } = req.user

    const data = await get(usuario_id)
    return responses.success(req, res, { courses: data }, 200)
  } catch (e) {
    return responses.error(req, res, { message: 'errors' }, 500)
  }
}

async function getCourse(req, res) {
  const { id } = req.params
  try {
    const result = await db.selectOneWhere(TABLES.COURSES, { id })
    return responses.success(req, res, { course: result }, 200)
  } catch (e) {
    console.log(e.message)
  }
}

async function enrollCourse(req, res) {
  const { id } = req.params
  const { usuario_id } = req.user

  const data = {
    user: usuario_id,
    aula: id
  }
  try {
    const result = await db.insertWhere(TABLES.COURSES, data, data)

    return responses.success(req, res, result, 200)
  } catch (e) {
    console.log(e.message)
  }
}

async function getLessonContent(req, res) {
  const { id } = req.params
  try {
    const result = await db.select(TABLES.LESSONS_CONTENT, { lesson_id: id })
    return responses.success(req, res, { result }, 200)
  } catch (e) {
    console.error(e.message)
    return responses.error(req, res, { message: e.message }, 500)
  }
}

async function getLessons(req, res) {
  const { id } = req.params
  try {
    const lessons = await db.select(TABLES.LESSONS, { room: id })
    return responses.success(req, res, { lessons }, 200)
  } catch (e) {
    console.error(e.message)
    return responses.error(req, res, { message: e.message }, 500)
  }
}

async function getContents(req, res) {
  const { id } = req.params
  try {
    const contents = await db.select(TABLES.LESSONS_CONTENT, { lesson_id: id })
    return responses.success(req, res, { contents }, 200)
  } catch (e) {
    console.error(e.message)
    return responses.error(req, res, { message: e.message }, 500)
  }
  // return responses.success(req, res, {}, 200)
}

const all = () => {
  return db.get(TABLES.AULA_VIRTUAL)
}

const enroll = (data) => {
  return db.insertWhere(TABLES.COURSES, data, data)
}

const getEnrolled = (user) => {
  return db.select(TABLES.COURSES, { user })
}

const get = (id) => {
  return db.selectWithJoin(TABLES.COURSES, TABLES.AULA_VIRTUAL, `${TABLES.COURSES_AULA} = ${TABLES.AULA_VIRTUAL_ID}`, { user: id })
}

const getRoomLessons = (id) => {
  return db.select(TABLES.LESSONS, { room: id })
}

const unroll = (id) => {
  return db.deleteWhereID(TABLES.COURSES, { id })
}

const getExams = (id) => {
  return db.selectMultipleWheres(TABLES.EXAMS, { roomID: id, published: 0 })
}

const getMyExams = async (req, res) => {
  const { usuario_id: user_id } = req.user

  try {
    const result = await db.select(tables.EXAMS_USERS, { user_id })

    return responses.success(req, res, result, 200)
  } catch (err) {
    console.log(err)
    return responses.success(req, res, { message: err.message }, 200)
  }

  // return db.select(TABLES.EXAMS_USERS)
}

const getTasks = async (req, res) => {
  const { roomId } = req.params
  // const { user } = req
  const result = await db.select(tables.TASKS, { id_room: roomId })
  return responses.success(req, res, result, 200)
}

const getTask = async (req, res) => {
  const { taskId } = req.params
  const result = await db.selectOneWhere(tables.TASKS_CONTENT, { tarea: taskId })
  return responses.success(req, res, result, 200)
}

const getFeedback = async (req, res) => {
  const { taskId } = req.params
  const { usuario_id } = req.user
  const result = await db.selectOneMultipleWheres(tables.FEEDBACK, { usuario_id, task: taskId })
  return responses.success(req, res, result, 200)
}

const createTask = async (req, res) => {
  const { roomId } = req.params

  const data = {
    title: req.body.title,
    desc: req.body.desc,
    expired_at: req.body.expired_at,
    id_room: Number(roomId)
  }

  try {
    const save = await db.insert(tables.TASKS, data)
    return responses.success(req, res, save, 200)
  } catch (error) {
    console.log(error.message)
    return responses.success(req, res, { message: 'error al guardar' }, 200)
  }
}

const deleteTask = async (req, res) => {
  const { taskId } = req.params

  try {
    const save = await db.deleteWhereID(tables.TASKS, { id: taskId })
    return responses.success(req, res, save, 200)
  } catch (err) {
    return responses.error(req, res, { message: 'error' }, 500)
  }
}

const getCompletedTasks = async (req, res) => {
  const { taskId } = req.params
  const { usuario_id } = req.user

  try {
    const result = await db.selectOneMultipleWheres(tables.TASKS_USERS, { user: usuario_id, tarea: Number(taskId) })
    return responses.success(req, res, result, 200)
  } catch (error) {
    console.error(error.message)
    return responses.error(req, res, { message: 'ocurrió un error' }, 500)
  }
}

const saveCompletedTask = (req, res) => {
  const { taskId } = req.params
  const { usuario_id } = req.user

  const values = {
    user: usuario_id,
    tarea: Number(taskId),
    ...req.body
  }

  const where = {
    user: usuario_id,
    tarea: Number(taskId)
  }

  db.insertWhereV2(tables.TASKS_USERS, values, where)
    .then(result => {
      if (result.exists) {
        return responses.error(req, res, result, 409)
      }
      return responses.success(req, res, result, 200)
    }).catch(err => {
      console.error(err)
      return responses.error(req, res, err, 500)
    })
}

const getCourseInfo = async (req, res) => {
  try {
    const { id, room } = req.params

    const user = await db.select(TABLES.USUARIOS, { usuario_id: id })
    const alumnos = await db.select(TABLES.COURSES, { aula: room })
    return responses.success(req, res, { name: user[0].nombre, userpic: user[0].userimage, students: alumnos.length })
  } catch (e) {
    return responses.error(req, res, { message: e.message }, 500)
  }
}

module.exports = { getFeedback, getTask, getCourseInfo, saveCompletedTask, getCompletedTasks, deleteTask, createTask, getTasks, getMyExams, getLessons, getLessonContent, getCourses, getCourse, getAllCourses, enrollCourse, getAll, all, getExams, enroll, getEnrolled, get, unroll, getRoomLessons, getContents }
