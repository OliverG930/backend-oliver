const { insert, update, deleteWhereID, select, selectOneWhere } = require("../../../DB/crud")
const { LESSONS, FILES } = require("../../../utils/tables")

function updateLesson(lesson_id, data) {
    return update(LESSONS, data, { leccion_id: lesson_id })
}
function createLesson(aula_id, user_id) {
    return insert(LESSONS, { aula_id: aula_id, user_id: user_id })
}

function deleteLesson(lesson_id) {
    return deleteWhereID(LESSONS, { leccion_id: lesson_id })
}

function getLesson(id) {
    return selectOneWhere(LESSONS, { leccion_id: id })
}

function getAllLessons(room_id) {
    return select(LESSONS, { aula_id: room_id })
}

function getLesssonFiles(lesson_id) {
    return select(FILES, { leccion_id: lesson_id })
}

module.exports = {
    createLesson,
    updateLesson,
    deleteLesson,
    getLesson,
    getAllLessons,
    getLesssonFiles
}