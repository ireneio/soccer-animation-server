import websocket from 'websocket'
import chalk from 'chalk'
import axios from 'axios'
import { port } from '../app.mjs'

const W3CWebSocketServer = websocket.w3cwebsocket

export async function getTempSoccerData() {
  try {
    const res = await axios.get(`http://localhost:${port}/soccerData.json`)
    const filteredData = mapData(res.data.events)
    return filteredData
  } catch(e) {
    throw new Error(e)
  }
}

function mapTempSoccerData(data) {
  const mapXMultiplier = 8
  const mapYMultiplier = 3.6
  const mappedData = data.map(event => {
    const { info,
      matchScore,
      matchTime,
      side,
      type,
      typeId,
      posX,
      posY 
    } = event

    // console.log(type, info, typeId)
    let mapper = {
      event: '',
      team: '',
      x: (Number(posX) * mapXMultiplier).toFixed(2),
      y: (Number(posY) * mapYMultiplier).toFixed(2),
      matchTime,
      matchScore,
      matchInfo: info
    }

    switch(side.toString().toUpperCase()) {
      case 'HOME':
        mapper.team = 0
        break;
      case 'AWAY':
        mapper.team = 1
        break;
      default:
        break
    }

    // ballSide
    switch(Number(typeId)) {
      case 152:
        mapper.event = 'ballSide'
        break;
      case 151:
        mapper.event = 'goalBall'
        break;
      case 1029:
        mapper.event = 'attackDanger'
        break;
      case 1126:
        mapper.event = 'lineTo'
        break;
      case 110:
        mapper.event = 'moveTo'
        break;
      case 153:
        mapper.event = 'overstep'
        break;
      case 156:
        mapper.event = 'goalMiss'
        break;
      case 40:
        mapper.event = 'cardYellow'
        break;
      case 50:
      case 45:
        mapper.event = 'cardRed'
        break;
      case 155:
        mapper.event = 'goalIn'
        break;
      case 154:
        mapper.event = 'ballCorner'
        break;
      case 150:
        mapper.event = 'free'
        break;
      default:
        break
    }
    return mapper
  })
  return mappedData
}

function mapData(data) {
  const mappedData = mapTempSoccerData(data)
  return mappedData
}

// W3C Socket Client
export async function initW3CClient(matchId) {
  try {
    const client = await new W3CWebSocketServer(`ws://api-lekima-demo.ceshi22.com/product/animation/websocket-livedata?iid=${matchId}`, '')
    // console.log(chalk.blue('W3C Client Created.'))

    client.onerror = function () {
      console.log(chalk.red.bold('W3C Connection Error!'))
    }

    client.onopen = function () {
      // console.log(chalk.green('W3C Client Connected.'))
    }

    client.onclose = function () {
      // console.log(chalk.green('W3C Client Closed.'))
      initW3CClient()
    }

    client.onmessage = function (e) {
      console.log(e)
      // if (typeof e.data === 'string') {
      //   latestData = mapData(JSON.parse(e.data))
      // }
    }

    return true
  } catch (e) {
    console.log(chalk.red(e.message))
  }
}
