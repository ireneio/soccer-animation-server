import chalk from 'chalk'
import * as http from 'http'
import { init as initW3CClient } from './ws/auth.mjs'
import { init as initWsServer } from './ws/server.mjs'
import { init as initHttpClient, matchList } from './http/index.mjs'
import { getTempSoccerData } from './ws/client.mjs'
import AsyncMimicByTimeline from './modules/asyncMimicByTimeline.mjs'
import express from 'express';
import '@babel/polyfill';

export let matchId = ''
export let latestData = null
let asyncMimic

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
    await initGameplay()
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
  console.log((new Date()) + '\nServer is listening on port: ' + chalk.cyan('8081'))
})

async function init() {
  try {
    await initWsServer(app)
    await initHttpClient()

    matchId = matchList[0]
    console.log(chalk.blueBright('Initial Match ID: ' + matchId))

    await initW3CClient(matchId)
  } catch (e) {
    console.log('error in Main: ' + chalk.red(e.message))
  }
}

async function initGameplay() {
  asyncMimic = new AsyncMimicByTimeline(getTempSoccerData)
  await asyncMimic.init()

  function getEvent() {
    setTimeout(async () => {
      const data = await asyncMimic.getPreviousEvent()
      latestData = { ...data }
      console.log(asyncMimic.getTimeString())
      console.log(chalk.blueBright('Latest Data: ') + JSON.stringify(latestData) + '\nEvent End\n------------')
      getEvent()
    }, 1000)
  }
  getEvent()
}

await init()

export default app
