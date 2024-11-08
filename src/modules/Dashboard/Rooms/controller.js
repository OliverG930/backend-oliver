const db = require("../../../DB/crud")

const TABLES = require("../../../utils/tables")

const all = () => {

    return db.get(TABLES.AULA_VIRTUAL)

}

const enroll = (data) => {
    return db.insertWhere(TABLES.COURSES, data, data)
}

const getEnrolleds = (user) => {
    return db.select(TABLES.COURSES, { user: user })
}

const get = (id) => {
    return db.selectWithJoin(TABLES.COURSES, TABLES.AULA_VIRTUAL, `${TABLES.COURSES_AULA} = ${TABLES.AULA_VIRTUAL_ID}`, { user: id })
}

const getRoomLessons = (id) => {
    return db.select(TABLES.LESSONS, { room: id })
}

const unroll = (id) => {
    return db.deleteWhereID(TABLES.COURSES, { id: id })
}

const getLessons = (id) => {
    return db.select(TABLES.LESSONS_CONTENT, { lesson_id: id })
}

const getExams = (id) => {
    console.log(TABLES.EXAMS, { roomID: id })
    return db.select(TABLES.EXAMS, { roomID: id })
}

module.exports = { getExams, all, enroll, getEnrolleds, get, unroll, getRoomLessons, getLessons }