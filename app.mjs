import chalk from 'chalk'
import * as http from 'http'
import { init as initW3CClient } from './ws/auth.mjs'
import { init as initWsServer } from './ws/server.mjs'

const app = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url)
    response.writeHead(200)
    response.end('Server Running.')
})

app.listen(8081, function() {
    console.log((new Date()) + ' Server is listening on port: ' + chalk.cyan('8081'))
})

await initW3CClient()
await initWsServer(app)

export default app
