import websocket from 'websocket'
import chalk from 'chalk'

const W3CWebSocketServer = websocket.w3cwebsocket

export let latestData

function mapData(message) {
  // TODO
  return message
}

// W3C Socket Client
export async function initW3CClient() {
  try {
    const client = await new W3CWebSocketServer('ws://api-lekima-demo.ceshi22.com/product/animation/websocket-livedata?iid=24847468', '')
    console.log(chalk.blue('W3C Client Created.'))

    client.onerror = function() {
      console.log(chalk.red.bold('W3C Connection Error!'))
    }
    
    client.onopen = function() {
      console.log(chalk.green('W3C Client Connected.'))
    }
    
    client.onclose = function() {
      console.log(chalk.green('W3C Client Closed.'))
      initW3CClient()
    }

    client.onmessage = function(e) {
      if (typeof e.data === 'string') {
        latestData = mapData(JSON.parse(e.data))
      }
    }

    return true
  } catch(e) {
    console.log(chalk.red(e.message))
  }
}
