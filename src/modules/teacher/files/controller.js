/* eslint-disable space-before-function-paren */
const db = require('../../../DB/crud')
const responses = require('../../../red/responses')
const tables = require('../../../utils/tables')

// delete files function
async function deleteFile(req, res) {
  try {
    const { file } = req.params

    const table = tables.FILES

    await db.deleteWhereID(table, { archivo_id: file })
      .then(result => {
        return responses.success(req, res, { message: `File ${file} deleted!` }, 200)
      })
      .catch(e => {
        return responses.error(req, res, { message: e.message }, 200)
      })
  } catch (e) {
    return responses.error(req, res, { message: e.message }, 200)
  }
}

module.exports = {
  deleteFile
}
