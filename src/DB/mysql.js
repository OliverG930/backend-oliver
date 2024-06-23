//mysql2 
//DOC: https://sidorares.github.io/node-mysql2/docs
const mysql = require('mysql2')
const config = require('../config')

const CONECTION_LOST = config.mysql.connection_lost

const db_config = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.db,
}


const conn = () => {
    let connection = mysql.createConnection(db_config)

    connection.connect((err) => {
        if (err) {
            console.log("[db:err] ", err)
            setTimeout(conn, 2000)
        } else {
            console.log('mysql connected!')
        }
    })

    connection.on('error', err => {
        if (err.code === CONECTION_LOST) {
            conn()
        } else {
            throw err
        }
    })

    return connection
}

module.exports = {
    conn
}