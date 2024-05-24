import { Router } from 'express'
import Message from '../models/message.mjs'
import express from 'express'

const router = new Router()

// const messages = [
//     {text: 'hello', from: 'joe', sent: null},
//     {text: 'hi', from: 'joe', sent: null},
//     {text: 'hola', from: 'jose', sent: null},
//     {text: 'annyeong', from: 'sam', sent: null}
// ]

// parse incoming json body in to req.body
router.use(express.json())

router.get('/api/messages', async (req, res) => {
    // get all documents
    let q = {}
    const messages = await Message.find(q)
    res.json(messages.map(m => {
        return {text: m.text, from: m.from, sent: m.sent}
    }))
})

router.post('/message', async (req, res) => {
    // make sure json keys in body match this destructuring
    // {text: 'hi', from: 'joe'}
    const {text, from} = req.body
    try {
        const m = new Message({text, from})
        const savedMessage = await m.save()
        res.json({error: null, data: savedMessage})
    } catch(e) {
        res.json({error: 'could not save', data: null})
    }
})

export default router