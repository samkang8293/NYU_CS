import express from 'express'
import {createServer} from 'http'
import {Server} from 'socket.io'

const app = express()

import url from 'url'
import path from 'path'

const __dirname = path.join()

app.use(express.static())

const server = createServer(app)
const io = new Server(server)

io.on('connection', socket => {
    console.log(socket.id, 'has connected')
    socket.on('mouse', data => {
        // let's add unique id to x and y
        // coords for client
        data.id = socket.id
        // send to everyone except the client
        // that just sent this data
        console.log(data)
    })
})

server.listen(3000)