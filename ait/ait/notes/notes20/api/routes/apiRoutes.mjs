import { Router } from 'express'
import Message from '../models/message.mjs'
import express from 'express'
import cors from 'cors'

const router = new Router()

// middleware that sets cross origin resource sharing headers
// (access-control-allow-origin)
router.use(cors())


// const messages = [
//     {text: 'hello', from: 'joe', sent: null},
//     {text: 'hi', from: 'joe', sent: null},
//     {text: 'hola', from: 'jose', sent: null},
//     {text: 'annyeong', from: 'sam', sent: null}
// ]

// parse incoming json body in to req.body
router.use(express.json())

router.get('/messages', async (req, res) => {
    console.log('/api/messages was requested', req.query)
    // get all documents
    const q = {}

    // find(queryObject, projectObject)
    // {}: all documents
    // {from: 'joe'}: all docs within from field that has value joe
    // {prop: {$gt: 100}}: all docs with prop field that has value > 100
    // .sort(arg): arg is an object that specs sort field
    // {fieldName: 1} .. sort ascending, -1 sort descending

    // 2. extract query string and modify query to find all after sent date
    if (req.query.lastSentDate) {
        q['sent'] = {$gt: req.query.lastSentDate}
    }

    const messages = await Message.find(q).sort({ sent: 1 })
    // alt to this is pass second arg to find, with _id: 0
    res.json(messages.map(m => {
        return {text: m.text, from: m.from, sent: m.sent}
    }))
})

router.post('/message', async (req, res) => {
    // make sure json keys in body match this destructuring
    // {text: 'hi', from: 'joe'}
    const {text, from} = req.body
    try {
        // 1. add date to all messages
        const m = new Message({text, from, sent: new Date()})
        const savedMessage = await m.save()
        res.json({error: null, data: savedMessage})
    } catch(e) {
        res.json({error: 'could not save', data: null})
    }
})

export default router