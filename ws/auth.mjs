import axios from 'axios'
import chalk from 'chalk'

// W3C Client
import { initW3CClient } from './client.mjs'

async function sendAuthRequest() {
  const res = await axios.get('https://api-lekima-demo.ceshi22.com/product/animation/testReceive')
  if(res.status === 200) {
    console.log(chalk.green('Protocol Authentication Success.'))
    return true
  } else {
    return false
  }
}

export async function init() {
  try {
    const initClient = await initW3CClient()
    if(initClient) {
      const authResult = await sendAuthRequest()
      if(!authResult) {
        throw new Error('Protocol Authentication Error!')
      }
    } else {
      throw new Error('Initiation of W3C Client Failed!')
    }
  } catch(e) {
    console.log(chalk.red(e.message))
  }
}
