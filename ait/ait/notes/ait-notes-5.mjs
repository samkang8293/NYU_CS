// notes - check brightspace announcements 4 where notes are uploaded

/* 
NOTES
    Application Layer - application level protocols such as HTTP, SMTP, etc.

    Network layer - protocol responsible for routing parts of data

    The one we care about the MOST:
        - TCP/IP - the Underlying Protocol of the Internet

    Web
        - Collection of interconnected docs connected by links
    
    URL
        - Domain (ex: cs.nyu.edu)
            - TLD - Top Level Domain
            - cat /etc/hosts 
                - sees domains and hosts of machines/servers
        - Fragments (ex: /#foo after cs.nyu.edu/index.html or path/string)
        - Path (/index.html after cs.nyu.edu or domain)
        - Query_string (?q=chug+dog after path)
        - Protocol (https:// - comes way before everything)
        - Order: Protocol username:password@domain path query string fragment
        - cs.nyu.edu
            - cs could be running ssh server, ftp, web server

    http
        - simple request/response protocol
        - earlier version of http were plain text
        - later versions are in binary
        - semantics are the same
    
    client ... sends a request for a resource
        - browser: chrome, safari, firefox, etc.
        - cli (command line interface) clients: curl, wget, etc.
        - library/programmatic client: fetch / xhr w/ client side js, requests module in python
    server ... responds with that resource (or some other response)
        - we can make our own server with node
        - cots - apache, nginx, etc
        - unicorn(python), webrick in java ... some lib that serves your application

    client
    GET /index.html HTTP/1.1 --> http method path (typically path does not include domain http version)
    host: www.foo.pizza --> headers, headername: header value \r\n

    http methods:
        - GET - read a resource
        - POST - create or update a resource
        ^^^ u can get ur browseer to do this by clicking a link, submitting a form, url bar
        - PUT
        - DELETE
        - READ

    response:
        HTTP/1.1 200 OK// version status code, desc of status code
        Content-Type: text/html
        Content-Length: 123

    Optional Body
        200 - OK
        302 - redirects
        304 - 
        403 - Forbidden
        404 - File not Found
        500 - Server Error

        1xx - informational
        2xx - good
        3xx - redirect
        4xx - client side errors? - if u make same req, you'll prob get same request
        5xx - server side errors?

        http/1.1 301 Perm redirect

        Clicking on link usually calls GET

        nc - swiss army knife for tcip/ip connections
            - manually write http request
            - u can connect to other applications (email server)

        curl - cli for http

*/

// socket -> endpoint in communication between two computers
// in library/module, typically socket will refer to "other end"
// if creating server, socket is the client

//echo server - sends back whatever was sent to it

// create server that allows connection from netcat
// not yet talking about http

// When running the server file, have two windows open: one for running the server
// and one for connecting. In running window, run the file and in connecting,
// type: nc localhost 3000

import { createServer } from 'net'

const handleData = (data, sock) => {
    // we have data that was sent to us
    // to impl echo server, let's send back data
    console.log(data + '')
    sock.write('HTTP/1.1 200 OK\r\n')
    sock.write('Content-Type: text/html\r\n')
    sock.write('\r\n')
    sock.write('<h1>Hello</h1>')
    sock.end()
}

const handleConnect = sock => {
    sock.on('data', (data) => handleData(data, sock))
    console.log('hello')
}
const server = createServer(handleConnect)
server.listen(3000, '127.0.0.1')