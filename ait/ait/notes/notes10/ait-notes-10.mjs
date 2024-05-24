// import {readFile} from 'fs'

// console.log('start')
// readFile('./notes.md', 'utf-8', (err,data) => {
//     console.log(data)
//     console.log('end')
// })
import './config.mjs'
import './db.mjs'
import express from 'express'
import mongoose from 'mongoose'

const Cat = mongoose.model('Cat')

const app = express()
app.get('/', async (req, res) => {
    const cats = await Cat.find({})
    res.json(cats)
})

console.log(process.env.PORT)
app.listen(process.env.PORT ?? 3000)