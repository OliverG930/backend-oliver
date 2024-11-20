const crud = require("../../../../DB/crud")
const { LESSONS_CONTENT, LESSONS } = require("../../../../utils/tables")

function all(lesson) {
  return crud.select(LESSONS_CONTENT, { lesson_id: lesson })
}

function create(data) {
  return crud.insert(LESSONS_CONTENT, data)
}

function remove(content) {
  return crud.deleteWhereID(LESSONS_CONTENT, { ID: content })
}

function getLessons(data) {
  return crud.select(LESSONS, data)
}

module.exports = {
  all,
  create,
  remove,
  getLessons
}