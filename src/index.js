const http = require('http')
const app = require('./app')
const pc = require('picocolors')

const server = http.createServer(app)

server.listen(app.get('port'), () => {
  console.log(pc.green(`server on port http://lolcahost:${app.get('port')}`))
})
