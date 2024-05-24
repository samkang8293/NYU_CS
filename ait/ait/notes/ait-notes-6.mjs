/*
NOTES
-----------
    Net Module
    * create tcp/ip servers (and clients too)
        * we can have long running process listening for connecitons over tcp/ip
        * there's application layer present
        * so we can connect to server using browser, netcat, anything that can make conn over tcp/ip
        * if we try to send it a web request, we have to parse the request and come up w/ response
    * hello world: echo server ... sent back the data that was sent to it
    
    createServer(fn) // fn is function called when client connects
    fn(sock) // sock is the connected client (it's passed into function when client connects)
    sock.on // register callback ... based on well known events (e.g. 'data')
    sock.write // write data to connected client
    sock.end // ends the connection
*/

class Request {
    constructor(s) {
        const [method, path, ...everythingElse] = s.split(' ')
        this.method = method
        this.path = path     
    }

    toString() {
        return `${this.method} ${this.path}`
    }
}

class Response {
    constructor (sock, statusCode=200, desc="OK", contentType="text/html") {
        this.sock = sock
        this.statusCode = statusCode
        this.desc = desc
        this.contentType = contentType
    }

    send(s) { // send will send back response with s as body
        // 
        this.sock.write(`HTTP/1.1 ${this.statusCode} ${this.desc}\r\n`)
        this.sock.write(`Content-Type: ${this.contentType}\r\n`)
        this.sock.write('\r\n')
        this.sock.write(s)
        this.sock.end()
    }
}

import {createServer} from 'net'
// ONE WAY (NESTED FUNCTIONS)
// const server = createServer(sock => {
//     console.log('client connected')
//     sock.on('data', (data) => { // 2 args, first arg is evt name as a str
//         // second arg is callback function to be called when event is triggered
//         // in case of receiving data, data that was sent to use from client
//         // cb is invoked with that data
//         sock.write(data + '')
//     })
// })

// SECOND WAY (SEPARATE FUNCTIONS)
// const handleData = (sock, data) => {
//     sock.write(data + '')
// }

// const handleConnect = sock => {
//     console.log('client connected')
//     // sock.on('data', handleData.bind(null, sock)) // this is called w/ one arg, data
//     sock.on('data', data => handleData(sock, data))
// }

// const server = createServer(handleConnect)


const handleData = (sock, data) => {
    const request = new Request(data + '')
    const response = new Response(sock)
    console.log(request.toString())
    // sock.write('HTTP/1.1 200 OK\r\n')
    // sock.write('Content-Type: text/html\r\n')
    // sock.write('\r\n')
    // sock.write('<h1>this is the request that u sent me</h1><pre>' + data + '</pre>\r\n')
    // sock.end()

    if (request.path === '/chug') {
        response.send('<h1>CHUG!!!!!</h1>')
    }
    else if (request.path === '/poodle') {
        response.send('<h2>poooooooodle</h2>')
    }
    else {
        response.statusCode = '404'
        response.desc = 'Not Found'
        response.contentType = 'text/plain'
        response.send('no dog 4 u')
    }
}

const handleConnect = sock => {
    console.log('client connected')
    // sock.on('data', handleData.bind(null, sock)) // this is called w/ one arg, data
    sock.on('data', data => handleData(sock, data))
}

const server = createServer(handleConnect)
const [PORT, HOST] = [3000, '127.0.0.1']
server.listen(PORT, HOST)
console.log('server is listening on ', PORT, HOST)