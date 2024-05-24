/*
NOTES (CONTINUING OFF OF WHERE WE LEFT OFF IN NOTES 6)
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

    2 classes
    * Request (HTTP)
        * store path and method
        * String rep of req
    * Response (HTTP)
        * sending back http response
        * hold on to socket
        * method to actually write to socket
        * all parts of response are in constructor
    

    App class
    * tcp/ip server
        * handleData
        * handleConnect
    * routes object
    * listen method
    * get method
    
    import App from './module.mjs'
    const app = new App()
    app.get('/cats', (req,res) => {
        res.send('i like cats!!!!')
    })

    app.listen(port)

    WEB FRAMEWORK
    1. access request and response
    2. routing - maps paths to functions
    3. templating

    ## server side web framework

    express
        micro framework
        server side
        it does not tell u where to put files
        * req, res obj
        * templating
        * routes
        * middleware
            * server static files
            * cookies
            * sessions

    1. monolithic
        * feature-full
        * they have all features listed below
        * dictate how your app is structure
        * example
            * python
                * django
            * Ruby
                * rails
            * php
                * laravel
    
    2. micro
        * less features
        * integrate other libraries
        * dictate the layout (of project)
        * easier to understand

    features for server side web framework

    * a bunch of tools/libraries that help with common tasks in web dev
        * specifically on the server
        * routing
        * access to http request and response
        * templating
        * database access
            * create, read, update, delete
        * form handling
        * hot reloading
        * session handling
        * authentication
        * cookies

    ## client side web framework

    * run on the client (ur browser)
    * features
        * reusable components
        * event handling
        * "reacting" to data changes
        * fetching data
    * examples
        * react
        * vue
        * svelte

    ## y not have both

    * next.js
    * nuxt
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

    // templateFn ... the path to our html file
    // that has placeholders
    // {{var}} var will be expanded to value
    // context ... the variables that go into our placeholders
    // res.render('cats.html', {name1: 'catsy cline', name2: 'garfield})
    // <h1>{{name}}</h1> ---> <h1>catsy cline</h1>

    render(templateFn, context) {
        readFile(templateFn, (err,data) => {
            if (err) {
                this.statusCode = 500
                this.desc = 'server error'
                this.send('uh oh, server err')
            }
            else {
                const body = data + ''
                // Object.entries turns obj into array
                // we want to reduce array into string of html
                // iteratively changing accumulator to replaced html
                const html = Object.entries(context).reduce((html, pair) => {
                    const [varName, val] = pair
                    return html.replace('{{' + varName + '}}', val)
                }, body)
                this.send(html)
            }
        })
    }

    sendFile(fn) {
        readFile(fn, (err, data) => {
            const body = data + ''
            this.send(body)
        })
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
import {readFile} from 'fs'

export default class App {
    constructor() {
        this.routes = {}
        // within handleConnect, this will be undefined
        this.server = createServer(sock => this.handleConnect(sock)) //this.handleConnect.bind(this)
    }
    // this --> the instance that the method was called on method invocation
    // undefined --> regular func invocation
    // ^^^^^^^^^
    // arrow function --> retain value of what this is when arrow function created

    get(path, cb) {
        this.routes[path] = cb;
    }

    handleData(sock, data) {
        const req = new Request(data + '')
        const res = new Response(sock)
        console.log(req.toString())

        if (Object.hasOwn(this.routes, req.path)) {
            const routeHandler = this.routes[req.path]
            routeHandler(req,res)
        }
        else {
            res.statusCode = 404
            res.desc = 'Not Found'
            res.contentType = 'text/plain'
            res.send('no dog 4 u')
        }
    }

    handleConnect(sock) {
        console.log('client connected')
        // sock.on('data', handleData.bind(null, sock)) // this is called w/ one arg, data
        sock.on('data', data => this.handleData(sock, data))
    }

    listen(port,host) {
        console.log('server is listening', port, host)
        this.server.listen(port, host)
    }
}

const routes = {
    '/chug': function(req, res) {res.send('<h1>CHUG!!!!!</h1>')},
    '/poodle': function(req,res) {res.send('<h2>poooooooodle</h2>')},
    '/terrier': function(req,res) {res.send('<em>terrierrrr</em>')}
}

// const handleData = (sock, data) => {
//     const req = new Request(data + '')
//     const res = new Response(sock)
//     console.log(req.toString())

//     if (Object.hasOwn(routes, req.path)) {
//         const routeHandler = routes[req.path]
//         routeHandler(req,res)
//     }
//     else {
//         res.statusCode = 404
//         res.desc = 'Not Found'
//         res.contentType = 'text/plain'
//         res.send('no dog 4 u')
//     }
// }

// const handleConnect = sock => {
//     console.log('client connected')
//     // sock.on('data', handleData.bind(null, sock)) // this is called w/ one arg, data
//     sock.on('data', data => handleData(sock, data))
// }

// const server = createServer(handleConnect)
// const [PORT, HOST] = [3000, '127.0.0.1']
// server.listen(PORT, HOST)
// console.log('server is listening on ', PORT, HOST)