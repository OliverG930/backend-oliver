// mysql2
// DOC: https://sidorares.github.io/node-mysql2/docs
const mysql = require('mysql2')
const config = require('../config')
const picocolors = require('picocolors')

const CONNECTION_LOST = config.mysql.connection_lost

const dbConfig = {
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.db
}

const conn = () => {
  const connection = mysql.createConnection(dbConfig)

  connection.connect((err) => {
    if (err) {
      console.log(picocolors.redBright('[db error] '), err)
      setTimeout(conn, 2000)
    } else {
      console.log(picocolors.magentaBright('mysql connected!'))
    }
  })

  connection.on('error', err => {
    if (err.code === CONNECTION_LOST) {
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
