## How to Prep
* for written
    * look at homework
    * quiz material (retake ur quiz if u want to practice)
    * class demo
* conceptual
    * brightspace quiz
    * slides
* old written exams (ignore var declaration, use esm)

## Cookies
* data stored on the client
* name=val pairs with some options
    * domain ... if u set this, it will include subdomains
        * (leaving it out is more restrictive)
    * httponly
    * samesite
    * secure
* cur implementation on chrome is sqlite db

## HTTP Response
* cookies are set on client when server sends response with the following header
* 'Set-Cookie: sessid=123123123;HttpOnly; Secure'
* (multiple cookies same response requires repeated header)

## HTTP Request
* cookies are continually sent back to domain that set them (according to options) via heaeder below:
* 'Cookie: sessid=123123123;foo=bar'
    * options not sent back
    * only one header contains all cookies

## Destructuring
* array destructuring:
 const arr= [1,2,3,4]
 const [a,b, ...leftOver] = arr
* obj destructuring: 
 const obj = {x: 100, y: 200, z: 300}
 const {x, y} = obj

const mySession = ({secret, resave, initializeBlank})

options = {secret: 'foo'}
mySession(options)

## Spread Operators
* can concatenate arrays: [...arr, ...arr2]
* can also concat obj: {...obj, a: 1, b: 2}
* const f = (...args) => {console.lof(args)} // unlimited arguments
* apply similar to spread but apply u can set this

## Net Module

## Prototype
* Object.hasOwn(req, 'toString') --> return false because on Object.prototype
* Object.getPrototypeOf(req) === Request.prototype
* all methods defined on prototype, not the instance
* Object.getPrototypeOf(Request) === Request.prototype --> false
* Object.getPrototypeOf(Request) === Function.prototype --> true