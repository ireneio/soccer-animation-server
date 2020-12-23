import websocket from 'websocket'
import chalk from 'chalk'
import * as util from 'util'
import { app as httpServer } from '../app.mjs'
import { latestData } from './client.mjs'

setInterval(() => {
  console.log(chalk.yellow('Latest Data: ') + util.inspect(latestData))
}, 1000)

function originIsAllowed(origin) {
  // TODO: detect origin
  return true
}

// WS server
const WebSocketServer = websocket.server

export async function init() {
  const wsServer = await new WebSocketServer({
    httpServer,
    autoAcceptConnections: false
  })

  console.log(chalk.blue('Web Socket Server created.'))

  wsServer.on('request', function(request) {

    // reject if origin disallowed
    if(!originIsAllowed) {
      request.reject()
      console.log((new Date()) + ' Connection from origin ' + chalk.yellow(request.origin) + ' rejected.')
      return
    }
  
    // init
    const connection = request.accept('echo-protocol', request.origin)
    console.log((new Date() + ' Connection accepted.'))
  
    // received
    connection.on('message', function(message) {
      // if(message.type === 'utf8') {
      //   console.log('Message Received: ' + message.utf8Data)
      //   connection.sendUTF(message.utf8Data)
      // } else if(message.type === 'binary') {
      //   console.log('Binary Message Received: ' + message.binaryData.length + ' bytes.')
      //   connection.sendBytes(message.binaryData)
      // }

      connection.sendUTF(latestData)
    })
  
    // close
    connection.on('close', function(reasonCode, description) {
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected. Reason: ' + reasonCode + '. Description: ' + description)
    })
  })
}
