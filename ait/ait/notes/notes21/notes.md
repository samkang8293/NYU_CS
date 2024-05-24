## Socket.io
* uses websockets
* falls back to polling/long polling w/ http
* api consists of 2 parts
    * 1 for server
    * client part
    * both libs share:
        * io
            * server: io is the running server
            * client: io is function to connect to server
        * socket
            * server: represents connected client
                * io.on('connection', cb) <--- first thing to do for ur server
            * client: client's connection to server
            * emit('event', data)
            * on('event', cb) ... cb is invoked w/ date from emit
    * additional methods for emit:
        * on the server:
            * sock.emit - emit to connected client
            * io.emit = send to all connected clients
            * sock.broadcast.emit - send to all clients except current
        
    