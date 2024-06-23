require('dotenv').config()

module.exports = {
    app: {
        port: process.env.PORT || 4000
    },
    jwt: {
        secret: process.env.SECRET || 'seckret',
        salt: process.env.SALT_ROUND || 10
    },
    mysql: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        db: process.env.DB || '',
        connection_lost: 'PROTOCOL_CONNECTION_LOST'
    }
}