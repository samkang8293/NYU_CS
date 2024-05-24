import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const server = createServer(app)
const io = new Server(server)

import url from 'url'
import path from 'path'

const __dirname = path

io.on('connection', sock => {
    console.log(sock.id, 'has connected')
    sock.on('chat', data => {
        
    })
})

server.listen(3000)