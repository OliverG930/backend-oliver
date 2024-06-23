const db = require('./../../DB/crud')

const create = (body) => {
    return db.create(body)
}
module.exports = {
    create
}