import websocket from 'websocket'
import chalk from 'chalk'

const W3CWebSocketServer = websocket.w3cwebsocket

export let latestData = null

function mapData(message) {
  // TODO
  // const { score, eventId, events } = message
  // const { matchTime, type, info, side, setNumber, typeId, gameNumber, gameScore, setScore } = events[0]
  // return {
  //   eventId,
  //   eventName: type || info || typeId,
  //   eventSide: side,
  //   matchNumber: gameNumber,
  //   matchScore: gameScore,
  //   matchTime: matchTime,
  //   setScore
  // }
  return message
}

// W3C Socket Client
export async function initW3CClient(matchId) {
  try {
    const client = await new W3CWebSocketServer(`ws://api-lekima-demo.ceshi22.com/product/animation/websocket-livedata?iid=${matchId}`, '')
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
