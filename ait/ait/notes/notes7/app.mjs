/*import App from './ait-notes-7.mjs'

const app = new App()

app.get('/cats', (req,res) => {
    // res.send('i like cats!!!!')
    res.render('./cats.template', {name: 'paw newman'})
})

app.get('/moarCats', (req,res) => {
    res.send('<ul><li>kitty purry</li><li>paw newman</li></ul>')
})

app.get('/catsAgain', (req, res) => {
    res.sendFile('./catsAgain.html')
})

app.listen(3000,'127.0.0.1')
*/

import express from 'express'

const app = express()
app.get('/', (req, res) => {
    res.send('this is express')
})

app.listen(3000)
