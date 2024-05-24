# in v2 (traditional database backed website, where most of the logic on server)
* cons:
    * perceptible lag when going from one page to another
* pros:
    * because most logic is on server, client doesn't have to be "powerful"
    * size of frontend part is smaller/less bandwith use

# v3 (AJAX/mostly frontend)
* cons:
    * introduces complexity
        * maybe running 2 separate servers
            * one that serves api
            * another that serves frontend application
        * or u have framework that covers both
            * express serves as api
                * and static handling middleware deals w/ frontend app
            * next does both api + frontend
    * seo might be complicated
* pros:
    * user experience, response is immediate-ish

we want ajax, but how?
* [x] we need something to serve the api .. express (send back json), flask, fastify
* [x] ability to manipulate the dom ... vanialla js can do this or frontend framework (vue, react)
* [x] data interchange format ... JSON
* [] make a background request
    * fetch - promise based http request (on the client only, node / server side js doesn't have fetch built in ... you'd have to dl a module)
    * xmlhttprequest - callback based http request
    * use some other library: axios, superagent
* fetch
    * makes background request
    * default is GET
    * args (url, options ..... this can be omitted)
    * return: promise
        * promise is fulfilled on success w/ response object (NOT the same as express response object)
        * respose object has methods and props
            * status code
            * text of body of response
            * .json() --> parse body as json ... also returns a promise, fulfilled w/ parsed object


## client side web app: github repo browser

* utilize github's REST api
* api.github.com/api/users/jversoza/repos
* docs will tell u: 
    * http req method
    * path to request
    * if there is authentication
        * token
        * oauth

## Same Origin Policy (SOP)

IMPLEMENTED ON CLIENT

* possible to turn off SOP

policy that governs what a browser should do with cross origin requests

* cross origin request - request to an origin that is not the same as the current
* origin: protocol, domain, and port
* in example for requesting cs.nyu.edu
    * current page is localhost:3000
    * request is cs.nyu.edu 80
    * these are not the same origin
* if it's a simple background request (fetch, xhr)
    * by simple: 
        * GET request
        * POST request that is _not_ application json
    * REQUEST actually happens
    * the response cannot be read by client side js
* if request is more complicated (POST that is json)
    * send "pre-flight" request
    * response will determine if actual request will go thru
    * contingent on headers:
        * if allow-access-control-origin allows the domain that request is coming from
        * then make real request

1. i log into github
2. if i open github in another tab, i'm still logged in
    * cookies hold session id
    * cookies are sent to server on request whenever domain matches
        * (or when appropriate based on cookie options)
3. i go to another site notsusatall.foo
4. on this site, there's a fetch request to github
    * maybe cookies are sent along with that request
    * this other site can have access to data and func that's behind login

SOP is one of many tools to prevent cross site request forgery (csrf)

one other tool for preventing this

crsf token
* when u generate a form
* u also generate token unique to that form
* use as value for hidden input <input type="hidden" value="mytoken">
* when form is submitted, if token does match, then request originated from something other than form submit

CORS - cross origin resource sharing

* headers that server can respond with
* these help the broswer determine how to handle same origin policy

using express to serve as our api

* we will still parse http request bodies
    * format is not epress.urlencoded
    * express.json()
* if we have different origins (frontend is served from diff origin than api)
    * use mw to set headers
    * app.use(cors())
* no templating system is needed (frontend will be all of our markup as static files)