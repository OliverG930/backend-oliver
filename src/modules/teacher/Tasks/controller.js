const TABLES = require("../../../utils/tables")

const crud = require("../../../DB/crud")

function addNewTask(id) {

    return crud.insert(TABLES.TASKS, { id_aula_virtual: id })

}

function deleteTask(id) {

}

module.exports = { addNewTask, deleteTask }