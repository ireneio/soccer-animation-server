import websocket from 'websocket'
import chalk from 'chalk'
// import * as util from 'util'
import { latestData } from './client.mjs'



function originIsAllowed(origin) {
  // TODO: detect origin
  return true
}

// WS server
const WebSocketServer = websocket.server

export async function init(server) {
  const wsServer = await new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
  })

  console.log(chalk.blue('Web Socket Server Created.'))

  wsServer.on('request', function(request) {

    // reject if origin disallowed
    if(!originIsAllowed) {
      request.reject()
      console.log((new Date()) + ' Connection from origin ' + chalk.yellow(request.origin) + ' rejected.')
      return
    }
   
    // init
    const connection = request.accept(null, request.origin)
    console.log((new Date() + chalk.blue(' Connection accepted.')))
  
    // received
    connection.on('message', function(message) {
      console.log(chalk.yellow('Message received: ' + message.utf8Data))
    })
  
    // close
    connection.on('close', function(reasonCode, description) {
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected. \nReason: ' + reasonCode + '. \nDescription: ' + description)
    })

    setInterval(() => {
      // console.log(chalk.yellow('Latest Data: ') + util.inspect(latestData))
      connection.sendUTF(JSON.stringify(latestData))
      console.log(chalk.blueBright(new Date().toLocaleString('zh-TW') + ' Data Sent.'))
    }, 1000)
  })
}
