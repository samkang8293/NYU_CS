import express from 'express'
const app = express()

const myCookieParser = (options) => {
    return (req, res, next) => {
        // req.cookies = {}
        const cookies = req.get('Cookie')
        req.cookies = cookies.split(';').reduce((obj, s) => {
            const [name, val] = s.split('=')
            // maybe downside, instantiate new obj each time (also uses lots of computing power)
            return {...obj, [name]:val} // this also works the same way
            // obj[name] = val
            // return obj
        }, {})
        console.log(cookies)
        next()
    }
}
app.use(myCookieParser({}))

app.get('/', (req, res) => {
    console.log(req.cookies)
    res.send('thank u for ur cookies')
})

app.listen(3000)