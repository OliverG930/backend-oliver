const http = require('http')
const app = require('./src/app')
const pc = require('picocolors')

const server = http.createServer(app)

server.listen(app.get('port'), () => {
  console.log(pc.green(`server on port http://localhost:${app.get('port')}`))
})
