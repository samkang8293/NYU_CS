import express from 'express'
import cors from 'cors'
import App from './App.jsx'

const app = express()
app.use(cors())

const books = [
    {_id: 1, title: 'Dune'},
    {_id: 2, title: 'Snowcrash'},
    {_id: 3, title: 'Frankenstein'}
]

app.get('/api/books', (res, req) => {
    res.json(books)
})

app.get('/api/regular', (req, res) => {
    res.json({msg: 'this is v normal'})
})

app.get('/api/delayed', (req, res) => {
    setTimeout(() => {
        res.json({msg: 'so slow 🕰️'})
    }, 2000)
    
})

app.listen(3000)