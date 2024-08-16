const crud = require("../../../DB/crud")
const { LESSONS } = require("../../../utils/tables")

function all(room) {
    return crud.select(LESSONS, { room: room })
}

function get(id) {
    return crud.selectOneWhere(LESSONS, { id: id })
}

function create(room, teacher) {
    return crud.insert(LESSONS, { room: room, teacher: teacher })
}

function remove(lesson) {
    return crud.deleteWhereID(LESSONS, { id: lesson })
}

function update(lesson, data) {
    return crud.update(LESSONS, data, { id: lesson })
}

module.exports = {
    all,
    get,
    create,
    update,
    remove
}