import express from 'express'
import * as path from 'path'


import { init as initW3CClient } from './ws/auth.mjs'
import { init as initWsServer } from './ws/server.mjs'

export const app = express()

await initW3CClient()
await initWsServer()

// routes
import indexRouter from './routes/index.mjs'


// ES6 dirname
const __dirname = path.resolve(path.dirname(''))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

export default app
