const { getConnection } = require('../../../DB/crud')

function getCourseTasks(id) {

    const connection = getConnection()


    /**
     * 
     
    --Get todos including shared todos by id
SELECT todos.*, shared_todos.shared_with_id
FROM todos
LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
WHERE todos.user_id = [user_id] OR shared_todos.shared_with_id = [user_id];
     * 
     */

    const queryStr = `
    SELECT tcc.lessons.id,tcc.lessons.room, 
    tcc.lesson_content.lesson_id, 
    tcc.lesson_content.value,
    tcc.lesson_content.type,
    tcc.lesson_content.ID
    FROM tcc.lessons
    RIGHT JOIN tcc.lesson_content ON tcc.lessons.id = tcc.lesson_content.lesson_id
    WHERE tcc.lessons.room = ?
    `


    return new Promise((_res, _rej) => {
        connection.query(queryStr, [id], (err, result) => {
            return err ? _rej(err) : _res(result)
        })
    })

}

module.exports = { getCourseTasks }