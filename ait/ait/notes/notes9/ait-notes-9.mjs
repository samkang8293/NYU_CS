import express from 'express'
import session from 'express-session'

const app = express()

app.set('view engine', 'hbs')

const complaints = []

const sessionOptions = {
    secret: 'secret for signing session id',
    saveUninitialized: false,
    resave: false
}

// this middleware ... access to
// req.session <--- an object where u can store arbitrary data about repeat client

app.use(sessionOptions)

// express.urlencoded returns a middleware function
// using this middleware function, parses form url encoded body
// ---> req.body
app.use(express.urlencoded({extended: false}))

app.use((req, res, next) => {
    console.log(req.method, req.path, req.query, req.body)
    next()
})

app.get('/', (req, res)=> {
    // assume that we saved name of person in session
    res.render('form', {name: req.session.name})
})
app.post('/', (req, res) => {
    // we will get name from form data
    // stash that in our session
    // (diff from global variable or db)
    req.session.name = req.body.name
    res.redirect('/')
})

app.post('/complaints/add', (req, res) => {
    const { line, complaintText } = req.body
    if (complaintText.length === 0) {
        res.render('complaintForm', {error: 'must have a complaint to make'})
    } else {
        const newComplaint = {line, complaintText, cats: Array.isArray(req.body.cats) ? req.body.cats : [req.body.cats]}
        complaints.push(newComplaint)
        res.redirect('/complaints')
    }
    // validate data
    // create new object
})

app.get('/complaints', (req, res) => {
    res.render('complaints', {complaints})
})

app.get('/complaints/add', (req, res) => {
    res.render('complaintForm', {})
})

app.get('/bake-u-cookie', (req, res) => {
    // res.set ... creates new header or overwrites exisiting
    // append allows setting of multiple headers with same name
    res.append('Set-Cookie', 'sessid=1234;HttpOnly')
    res.append('Set-Cookie', 'color=red')
    res.send('u haz a cookie')
})

app.listen(3000)

/*
    remember that client has returned
    * client sends request
    * server responds with message saying that this is ur unique id, give this to me every later req
    * client ^^^ but through??
        * 🚫 cart.html?sessid=23laihdaoisfasfkas
        * headers
            * Cookie: sessid=123432lansidbaedje
            * X-Foo: asdlanoifehoubbaps
        * 🚫 body - inconvenient ... all request have to POSTs
    
    what is a session

    sessions are not the same as authentication
    sessions =/= Cookies

    Cookies - bits of data stored on the client

    the ability to determine if same client has made request
    
    * the server will send back a cookie containing a session id
    * session id will point to some data stored on the server (ur cart, the fact that ur logged in, dark mode/light mode)
    * client will resend cookie on every request
    * server will take session id and unlock any data associated with that session
    
    HTTP Request

    there is only one header that contains all cookies to send!

    Cookie: name=val;name2=val2;....

    HTTP Response

    There can be multiple Set-Cookie headers in response
    Set-Cookie: name=value;option1;option2;...
    Set-Cookie: name1=value1

    ### options

    * security
        * by default cookies are sent only to domain that set them
        * domain or path - this allows subdomains, path only for specific paths
        * HttpOnly - prevents client side js from reading cookies
        * Secure - only send cookies when connection is over https
        * SameSite - determines when cokkies are sent if cross origin request is made
            * lax - if user navigates, then cookies for domain are sent to that domain when u click on link
            * strict - no cookies sent ever on cross origin request even if clicking on a link
            * none - cookies always sent
        
    * lifetime
        * expires
        * max age
    
*/