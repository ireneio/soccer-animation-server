import axios from 'axios'

export let matchList = []

async function getMatchList() {
  try {
    const result = await axios.get('https://api-lekima-demo.ceshi22.com/product/animation/manage/listInplayMatch')
    matchList = [ ...result.data.data ]
  } catch(e) {
    console.log(e.message)
  }
}

export function init() {
  setInterval(async () => {
    await getMatchList()
  }, 1000)
}