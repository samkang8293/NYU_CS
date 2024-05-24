import express from 'express'

const app = express()

const todos = [
    {name: 'finish demo', done: true},
    {name: 'publish milestone3', done: false}
]

app.get('/api/todos', (req, res) => {
    res.json(todos)
})

app.listen(3000)