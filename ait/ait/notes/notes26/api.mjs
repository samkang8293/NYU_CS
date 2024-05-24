import express from 'express'
import cors from 'cors'
const app = express()

app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
    console.log(req.method, req.path, req.body)
    next()
})

const todos = ['find notes.md', 'cry']

app.get('/api/todos', (req, res) => {
    res.json({data: todos})
})

app.post('/api/todos', (req, res) => {
    todos.push(req.body.todoName)
    const newTodo = req.body.todoName
    res.json({data: newTodo})
})

app.listen(3001)