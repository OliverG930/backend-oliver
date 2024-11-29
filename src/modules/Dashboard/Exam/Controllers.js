const db = require('../../../DB/crud')
const tables = require('../../../utils/tables')

async function saveResume (data) {
  return await db.insert(tables.EXAMS_USERS, data)
}

async function getResume (user_id, exam_id) {
  return await db.selectResume(tables.EXAMS_USERS, user_id, exam_id)
}

module.exports = { saveResume, getResume }
