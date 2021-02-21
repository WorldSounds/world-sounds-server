const http = require('http')
const app = require('./app')
const PORT = process.env.PORT || 6300

const server = http.createServer(app)

server.listen(PORT, () => console.log('i love you ' + PORT))