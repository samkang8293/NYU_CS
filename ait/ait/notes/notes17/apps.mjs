import express from 'express'

const app = express()

import url from 'url'
import path from 'path'
const __dirname = path.__dirname(url.fileURLToPath())

app.use(express.static(path.join(__dirname, 'public')))

const todos = [
    {name: 'finish this demo', done: true},
    {name: 'post milestone 2', done: false}
]

app.get('/', (req, res) => {
    res.send(todos)
})