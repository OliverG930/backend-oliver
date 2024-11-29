/* eslint-disable camelcase */
const db = require('../../../DB/crud')
const TABLES = require('../../../utils/tables')
const responses = require('../../../red/responses')
const tables = require('../../../utils/tables')

async function getAllCourses (req, res) {
  try {
    const rooms = await db.get(TABLES.AULA_VIRTUAL)
    return responses.success(req, res, { rooms }, 200)
  } catch (e) {
    console.log(e.message)
    return responses.error(req, res, { message: e.message }, 500)
  }
}

async function getAll (req, res) {
  const { id } = req.params

  const data = await get(id)
  responses.success(req, res, { courses: data }, 200)
}

async function getCourses (req, res) {
  try {
    const { usuario_id } = req.user

    const data = await get(usuario_id)
    return responses.success(req, res, { courses: data }, 200)
  } catch (e) {
    return responses.error(req, res, { message: 'errors' }, 500)
  }
}

async function getCourse (req, res) {
  const { id } = req.params
  try {
    const result = await db.selectOneWhere(TABLES.COURSES, { id })
    return responses.success(req, res, { course: result }, 200)
  } catch (e) {
    console.log(e.message)
  }
}

async function enrollCourse (req, res) {
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

async function getLessonContent (req, res) {
  const { id } = req.params
  try {
    const result = await db.select(TABLES.LESSONS_CONTENT, { lesson_id: id })
    return responses.success(req, res, { result }, 200)
  } catch (e) {
    console.error(e.message)
    return responses.error(req, res, { message: e.message }, 500)
  }
}

async function getLessons (req, res) {
  const { id } = req.params
  try {
    const lessons = await db.select(TABLES.LESSONS, { room: id })
    return responses.success(req, res, { lessons }, 200)
  } catch (e) {
    console.error(e.message)
    return responses.error(req, res, { message: e.message }, 500)
  }
}

async function getContents (req, res) {
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
  console.log(TABLES.EXAMS, { roomID: id })
  return db.select(TABLES.EXAMS, { roomID: id })
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

module.exports = { getMyExams, getLessons, getLessonContent, getCourses, getCourse, getAllCourses, enrollCourse, getAll, all, getExams, enroll, getEnrolled, get, unroll, getRoomLessons, getContents }
