/* Quiz Solution

    in mymodule.mjs:

    export function findByProp(fn, prop, cb) {
        readFile(fn, (err, data) => {
            const objects = JSON.parse(data + '')
            const filtered = objects.filter(o => Object.hasOwn(o, prop))

            cb(filtered)
        })
    }
*/

/*
    Toy Server side web framework

    * routing
    * templating
    * req and res
    * served static files (sort of)
    
    express (what it does above)

    micro server side web framework

    1. typically for APIs
    2. we'll use to serve actual web app

    Implements

    * all features that we implemented (routing, templating, etc.)
    * req and res are more featureful
        * res.status(...) to set status code
        * req.url ... to get full path + query string
        * req.query ... to get parsed query string
    * middleware
        * add functionality to your web app as functions that are run before and/or after req handler
        * common middleware (built in)
            * parsing json body
            * parsing form body
            * serving static files
        * installable
        * 
    templating
        * all logic is in ur code
        * display/semantics is in ur template
        * minimal control structures in your template
    Query String
        * name = value&name2=value2
        {name: value, name2: value2}

        req.query()

    values are ofc vals

    form

    * attributes
        * method = method used when request is made by browser
        * action = where the path is
        * if u leave action blank/don't include it, then path is same path that u are currently on
    * common elements
        * select - dropdown
        * textarea - multiline text field
        * input
            * type="text"
            * type="number"
    <form method = "GET" action = "/foo">

    result: GET /foo HTTP/1.1
            Content-Type: x-www-form-urlencoded

            username=samuelkang&password=""
    
    <input type="number" name="foo">
    ^^ name attribute shows up in query string

    common applications of middleware

    * add new property to the request or response object
    * intercept the request and send back different response rather than route handler
    * loggin
    
    to prevent confirm form resubmission, use this pattern:
        * post
        * redirect
        * to ... GET
        * 
    routehandler should send back 1 response
    * send --> sends response as html or json (depends on argument)
    * render --> read template, fills in placeholders with context obj, sends response as html
    * redirect --> sends a 3xx http response
    * json --> sends json response
*/

import express from 'express'
const app = express()

app.set('view engine', 'hbs')

const catsDB = [
    {name: 'mochi', lives: 8},
    {name: 'bill furry', lives: 7},
    {name: 'garfield', lives: 6}
]
// middleware
// adds new prop to the request obj
// req.body
// ...parsed body from http request
// (formatted as x-www-form-urlencoded)
app.use(express.urlencoded({extended:false}))
app.use((req, res, next) => {
    console.log(req.method, req.path, req.url)
    console.log('q string', req.query)
    console.log('body', req.body)
    // console.log(req.method, req.path, req.url, req.query)
    next() // to invoke the next middleware
})

/*
app.use((req, res, next) => {
    const fn = join public with req.path
    readFile(fn, (err, data) => {
        if (err) {
            next() // no file found
        }
        res.send(data)
    })
})
*/

app.use(express.static('public'))

app.use((req, res, next) => {
    console.log('another middleware')
    next()
})

app.get('/', (req, res) => {
    res.send('this is express!!!!')
})

app.get('/cats', (req, res) => {
    // res.send('Cats will go here')
    // console.log(req.path, req.url)

    console.log(req.query)
    let data = catsDB
    // using the minLives query string name
    // use that to filter cats displayed
    if (Object.hasOwn(req.query, 'minLives')) {
        data = data.filter(cat => cat.lives > parseInt(req.query.minLives))
    }
    res.render('cats', {cats: data})
})

app.post('/cats', (req, res) => {
    res.send("u made a new cat")
    //do ur validation here
    const {name, lives} = req.body
    catsDB.push({name, lives})

    res.redirect('/cats')
    // tells browser to make new request to GET /cats
})
app.listen(3000)