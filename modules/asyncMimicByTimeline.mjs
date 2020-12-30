import chalk from 'chalk'

// helpers
const asyncMimic = function(data, interval) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, interval)
  })
}
const asyncEventIterator = async function*(arr, interval, i) {
  while(i < arr.length) {
    const data = await asyncMimic(arr[i], interval)
    i++
    yield data
  }
}
// input format: 00:00
const parseTime = function(time) {
  const [ min, sec ] = time.split(':')
  const milliseconds = min * 60000 + sec * 1000
  return milliseconds
}

// Timer
function AsyncMimicFactoryTimer(milliseconds) {
  this.time = milliseconds
}
AsyncMimicFactoryTimer.prototype.getTime = function () {
  return this.time
}
AsyncMimicFactoryTimer.prototype.setTimeIncreaseByOneSecond = function () {
  return this.time += 1000
}
AsyncMimicFactoryTimer.prototype.setTimeDecreaseByOneSecond = function () {
  return this.time -= 1000
}

// Async
function AsyncMimicByTimeline(dataRequestFn, dataRequestVariableName = 'matchTime', time = 0, id = null, checkInterval = 1000) {
  this.id = id
  this.data = null
  this.currentIndex = 0
  this.currentEvent = null
  this.nextEvent = null
  this.previousEvent = null
  this.isUpdateEvent = false
  this.timer = new AsyncMimicFactoryTimer(time)
  this.timerAllowInitiation = false
  this.timerInitiated = false
  this.dataRequestFn = dataRequestFn
  this.dataRequestVariableName = dataRequestVariableName
  this.checkInterval = checkInterval
  this.isFirstIteration = true
  this.isGameStarted = false
}
AsyncMimicByTimeline.prototype.iterateAll = async function(interval, index) {
  (async(instance, interval, index) => {
    for await (let data of asyncEventIterator(instance.data, interval, index)) {
      instance.currentEvent = data
      if(currentGame === false) {
        break
      }
    }
  })(this, interval, index)
}
AsyncMimicByTimeline.prototype.getPreviousEvent = function() {
  return Promise.resolve(this.previousEvent)
}
AsyncMimicByTimeline.prototype.setPreviousEvent = function() {
  if(this.currentIndex > 0) {
    this.previousEvent = { ...this.data[this.currentIndex - 1], isUpdate: this.isUpdateEvent }
  }
}
AsyncMimicByTimeline.prototype.getNextEvent = function() {
  return Promise.resolve(this.nextEvent)
}
AsyncMimicByTimeline.prototype.setNextEvent = function() {
  this.nextEvent = { ...this.data[this.currentIndex + 1], isUpdate: this.isUpdateEvent }
}
AsyncMimicByTimeline.prototype.getCurrentEvent = function() {
  return Promise.resolve(this.currentEvent)
}
AsyncMimicByTimeline.prototype.setCurrentEvent = function() {
  if(this.isFirstIteration) {
    this.currentEvent = { ...this.data[0], isUpdate: this.isUpdateEvent }
    this.isFirstIteration = false
    return
  }
  this.currentEvent = { ...this.data[this.currentIndex], isUpdate: this.isUpdateEvent }
  this.currentIndex += 1
}
AsyncMimicByTimeline.prototype.yieldAndSetEvent = async function() {
  await asyncEventIterator(this.data, 0, this.currentIndex)
  this.setCurrentEvent()
  this.setNextEvent()
}
AsyncMimicByTimeline.prototype.setCurrentEventUpdateStatus = function() {
  return this.currentEvent.isUpdate = this.isUpdateEvent
}
AsyncMimicByTimeline.prototype.getGameTime = function() {
  const timeString = this.currentEvent[this.dataRequestVariableName]
  const milliseconds = parseTime(timeString)
  return milliseconds
}
AsyncMimicByTimeline.prototype.getData = async function() {
  try {
    const data = await this.dataRequestFn()
    return data
  } catch(e) {
    console.log(e.message)
  }
}
AsyncMimicByTimeline.prototype.getTime = function() {
  return this.timer.getTime()
}
AsyncMimicByTimeline.prototype.getTimeString = function() {
  return chalk.yellowBright('[Current Time] Timer: ') + this.timer.getTime() + chalk.yellowBright('\n[Current Time] Game: ') + this.getGameTime()
}
AsyncMimicByTimeline.prototype.isTimeMatch = function() {
  const gameTime = this.getGameTime()
  return gameTime === this.timer.getTime()
}
AsyncMimicByTimeline.prototype.initEvents = async function() {
  this.setCurrentEvent()
  this.setNextEvent()
  await this.yieldAndSetEvent()
}
AsyncMimicByTimeline.prototype.initVerifyEventLoop = async function() {
  await this.initEvents()
  const timeout = () => {
    setTimeout(async () => {
      this.setPreviousEvent()
      if(this.nextEvent.matchTime !== '00:00' && !this.isTimeMatch()) {
        this.timer.setTimeIncreaseByOneSecond()
      }
      if(this.currentEvent.matchTime === '00:00') {
        await this.yieldAndSetEvent()
      } else if(this.isTimeMatch()) {
        await this.yieldAndSetEvent()
        this.setNextEvent()
        this.previousEvent.isUpdate = true
      }
      timeout()
    }, this.checkInterval)
  }
  timeout()
}
AsyncMimicByTimeline.prototype.init = async function() {
  try {
    this.data = await this.getData()
    await this.initVerifyEventLoop()
  } catch(e) {
    console.log(e.message)
  }
}

export default AsyncMimicByTimeline
