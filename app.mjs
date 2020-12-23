import chalk from 'chalk'
import * as http from 'http'
import { init as initW3CClient } from './ws/auth.mjs'
import { init as initWsServer } from './ws/server.mjs'

const app = http.createServer(function(request, response) {
  console.log((new Date()) + ' Received request for ' + request.url)
  if(process.env.NODE_ENV !== 'production') {
    response.writeHead(200)
    response.end('Server Running.')
  } else {
    response.writeHead(404)
    response.end()
  }
})

app.listen(process.env.PORT || 8081, function() {
  console.log((new Date()) + ' Server is listening on port: ' + chalk.cyan('8081'))
})

try {
  await initW3CClient()
  await initWsServer(app)
} catch(e) {
  console.log(chalk.red(e.message))
}

export default app
