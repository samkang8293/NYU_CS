import './config.mjs'
import express from 'express'

// don't start app until we have
import mongoose from 'mongoose'
await mongoose.connect(process.env.DSN)

const app = express()

// static file serving
import url from 'url'
import path from 'path'
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

// add api routes to /api
import apiRoutes from './routes/apiRoutes.mjs'
// all routes in apiRoutes.mjs will be prefixed with /api
app.use('/api', apiRoutes)

app.use(express.static(path.join(__dirname, 'public')))
console.log('environment port is', process.env.PORT)
app.listen(process.env.PORT ?? 3000)