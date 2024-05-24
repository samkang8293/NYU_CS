## SOP
policy implemented on our client (specifically browser) governs what ur browser's behavior is when a cross origin takes place

cross origin: either the protocol, domain, or port that ur on does not match protocol domain or port that ur making a request to

1. simple background request: GET, or a POST w/ Content-Type form-url-encoded
    * request is made <---
    * client side js cannot read resposne

2. when it's a POST w/ type application/json (a more "complex" request)
    * it will send an "OPTIONS" request to check  if we can make this request
    * if we can't, then original request will not be made

helps prevent cross site request forgery

* SOP is totally dep on the client

## SOP Issue 
* server can send special in response (CORs headers ... access-control-allow-origin)
* connect to api from server (rather the background request)
    * use some lib to make requests from server side
    * 
1. u have a frontend app: myapp.foo
    * make a background (fetch) request to #2
    * this will be blocked by same origin policy
2. it relies on some api that's on another origin: api.someonelse.fbar
    * this api does not set CORs headers

# fake real time polling
1. ask for all messages
2. ask for only the latest message based on the last message that we received <---

we will need: 
* on server
    * include date in our documents
    * query our db using greater than some date
    * read last sent date from request
* on client
    * keep track of last sent date that we received
    * when we request messages add that last sent date
    * poll (!?)

polling
* resource inensive for client
    * we are calling function repeatedly
    * make connection, send request, get response...
* on the server
    * ALL clients are bombarding server w/ request

## websockets through socket.io

websockets =/= http

* different protocol
* full duplex communication btwn client and server
* socket.io - a library that uses websockets under the hood

socket.io
* not just websockets
    * can fall back to (long) polling?
    * has features like creating rooms for clients
* server component and a client component
    * both APIs are similar
    * methods match between client and server

emit from server
1. sock.emit (send to current client)
2. sock.broadcast.emit (send to all clients except current)
3. io.emit (sent to all clients)