import chalk from 'chalk'
import * as http from 'http'
import { init as initW3CClient } from './ws/auth.mjs'
import { init as initWsServer } from './ws/server.mjs'
import { init as initHttpClient, matchList } from './http/index.mjs'
import { getTempSoccerData } from './ws/client.mjs'
import express from 'express';
import '@babel/polyfill';

export let matchId = ''
export let latestData = null
let currentGame = null

const app2 = express(); 
export const port = process.env.EXPRESSPORT || 9001;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Credentials': true
}

app2.use(express.static('public'));

app2.listen(port, () => {
  console.log((new Date()) + '\nExpress is listening on port: ' + chalk.cyan(port))
})

app2.get('/list', function(req, res) {
  Object.keys(corsHeaders).forEach((key) => {
    res.setHeader(key, corsHeaders[key])
  })
  res.status(200)
  res.send(JSON.stringify(matchList))
})

app2.get('/id/:id', async function(req, res) {
  const { id } = req.params
  Object.keys(corsHeaders).forEach((key) => {
    res.setHeader(key, corsHeaders[key])
  })
  res.sendStatus(200)
  await initW3CClient(id)
})

app2.get('*', function(req, res) {
  res.sendStatus(404)
})



const app = http.createServer(async function (request, response) {
  console.log((new Date()) + ' Received request for ' + request.url)
  if (request.url.toString() === '/list') {
    response.writeHead(200, 'success', corsHeaders)
    response.end(JSON.stringify(matchList))
  } else if (request.url.toString().includes('/id/')) {
    matchId = request.url.split('/')[request.url.split('/').length - 1]
    response.writeHead(200, 'success', corsHeaders)
    response.end()
    await initW3CClient(matchId)
  } else if(request.url.toString() === '/init') {
    currentGame = false
    currentGame = true
    await asyncMimicFactory()
    console.log(chalk.blueBright('Match Restarted.'))
    response.writeHead(200, 'success', corsHeaders)
    response.end()
  }
  else {
    response.writeHead(404)
    response.end()
  }
})

app.listen(process.env.PORT || 8081, function () {
  console.log((new Date()) + '\n Server is listening on port: ' + chalk.cyan('8081'))
})

function AsyncMimicFactory() {

  function asyncMimic(data, interval) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data)
      }, interval)
    })
  }

  async function* asyncEventIterator(arr, interval, i) {
    while(i < arr.length) {
      const data = await asyncMimic(arr[i], interval)
      i++
      yield data
    }
  }

  async function iterate(incomingData, interval, index) {
    (async(incomingData, interval, index) => {
      for await (let data of asyncEventIterator(incomingData, interval, index)) {
        latestData = data
        console.log(chalk.blueBright('Latest Data: ') + JSON.stringify(latestData))
        if(currentGame === false) {
          break
        }
      }
    })(incomingData, interval, index)
  }

  async function init() {
    try {
      let index = 0
      const sendDataInterval = 1000
      const fullMatchData = await getTempSoccerData()
      await iterate(fullMatchData, sendDataInterval, index)
    } catch(e) {
      console.log(e.message)
    }
  }

  this.init = init
}

// function AsyncMimicFactoryWithTimeline() {

//   function asyncMimic(data, interval) {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve(data)
//       }, interval)
//     })
//   }

//   async function* asyncEventIterator(arr, interval, i) {
//     while(i < arr.length) {
//       const data = await asyncMimic(arr[i], interval)
//       i++
//       yield data
//     }
//   }

//   async function iterate(incomingData, interval, index) {
//     (async(incomingData, interval, index) => {
//       for await (let data of asyncEventIterator(incomingData, interval, index)) {
//         latestData = data
//         console.log(chalk.blueBright('Latest Data: ') + JSON.stringify(latestData))
//         if(currentGame === false) {
//           break
//         }
//       }
//     })(incomingData, interval, index)
//   }

//   async function init() {
//     try {
//       let index = 0
//       const sendDataInterval = 1000
//       const fullMatchData = await getTempSoccerData()
//       await iterate(fullMatchData, sendDataInterval, index)
//     } catch(e) {
//       console.log(e.message)
//     }
//   }

//   this.init = init
// }

async function init() {
  try {
    await initWsServer(app)
    await initHttpClient()

    matchId = matchList[0]
    console.log(chalk.blueBright('Initial Match ID: ' + matchId))

    await initW3CClient(matchId)
    currentGame = true

    const asyncMimic = new AsyncMimicFactory()
    await asyncMimic.init()

  } catch (e) {
    console.log('error in Main: ' + chalk.red(e.message))
  }
}

await init()


export default app
