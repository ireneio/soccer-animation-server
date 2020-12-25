import chalk from 'chalk'
import * as http from 'http'
import { init as initW3CClient } from './ws/auth.mjs'
import { init as initWsServer } from './ws/server.mjs'
import { init as initHttpClient, matchList } from './http/index.mjs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Credentials': true
}

export let matchId = ''

const app = http.createServer(async function(request, response) {
  console.log((new Date()) + ' Received request for ' + request.url)
  if(request.url.toString() === '/list') {
    response.writeHead(200, 'success', corsHeaders)
    response.end(JSON.stringify(matchList))
  } else if(request.url.toString().includes('/id/')) {
    matchId = request.url.split('/')[request.url.split('/').length - 1]
    response.writeHead(200, 'success', corsHeaders)
    response.end()
    await initW3CClient(matchId)
  } else {
    response.writeHead(404)
    response.end()
  }
})

app.listen(process.env.PORT || 8081, function() {
  console.log((new Date()) + ' Server is listening on port: ' + chalk.cyan('8081'))
})

async function init() {
  try {
    await initW3CClient(matchId)
    await initWsServer(app)
    await initHttpClient()
  } catch(e) {
    console.log(chalk.red(e.message))
  }
}

await init()


export default app
