function AsyncMimicFactoryBySeconds() {

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

export default AsyncMimicFactoryBySeconds