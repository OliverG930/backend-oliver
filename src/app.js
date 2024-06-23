const express = require('express')
const path = require("path")
const morgan = require('morgan')
const config = require('./config')
const cors = require('cors')
const clientsRouter = require('./modules/clients/routes')
const loginRouter = require('./modules/clients/login')
const registerRouter = require('./modules/clients/register')
const teacherRouter = require('./modules/teacher/routes')
const authRouter = require('./modules/auth')
const filesRouter = require('./modules/files')
const gptRouter = require('./modules/gpt')
const errors = require('./red/errors')



//create ap with express
//DOC: https://expressjs.com/
const app = express()

//middleware

//morgan https://github.com/expressjs/morgan
app.use(morgan('tiny'))
//app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
//app.use(morgan('dev'))
app.use(express.json())

//configurations
app.set('port', config.app.port)

//CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options. DOC: https://www.npmjs.com/package/cors
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs');

app.get('/docs', (req, res) => {
    res.render('index', {
        host: req.headers.host
    });
});

app.get('/docs/lessons', (req, res) => {
    res.render('teacher/lessons', {
        host: req.headers.host
    });
});



//routes api
app.use('/api/clients', clientsRouter)
app.use('/api/login', loginRouter)
app.use('/api/register', registerRouter)
app.use('/api/teacher', teacherRouter)
app.use('/api/auth', authRouter)
app.use('/api/files', filesRouter)
app.use('/api/gpt', gptRouter)


app.use(errors)

module.exports = app