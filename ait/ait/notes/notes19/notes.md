## when to restart server

1. if public code changes, restart is necessary
2. if public folder changes no restart is necessary
    * express static will reread the file on next request

We'll need two parts for this:
* initial implementation will be same express app
* parts:
    1. frontend: html and js that shows messages
    2. backend (API): route handlers in express app that respond with and repond request and JSON bodies
* eventually we will break out into two different servers

## project setup for express setup

* routes folder that contains all of our roiutes
* models folder that contains schema
* no handlebars

we will create a restful api

* http methods are the actions:
    * GET request ... read
    * POST request ... add or update
* the paths should be clear in the resource they represent

1. GET /api/messages - read messages (note, no version in path, but that's an option... also that it's plural implying multiple messages will come back)
2. POSt /api/message - add new message

## AJAX POST

1. u must have route that support POST
2. typically for AJAX requests, the content type is likely json
    * x-www-form-urlencoded will likely not be used
    * application/json
3. so on the server side
    * instead of (or in addition to) express.urlencoded()
    * express.json() ---> middleware that parses request bodies that are in json format into req.body

client
1. still use fetch
2. but pass in second arg to specify:
    * method: POST
    * headers (specifically content type)
    * body (this will be JSON)
3. when does client add new sent message to dom
    1. before message is sent
    2. after message is sent
    3. in either case: 
        * should check for error
        * if added to dom before, remove(!?)
        * if added to dom after, skip adding

if u want to use json as data interchange format

1. client
    * specify content type is application/json
    * body of request should be in that format
2. server
    * u must specify how to deal with application/json