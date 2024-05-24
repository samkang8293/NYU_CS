const res = await fetch('/api/todos')
const todos = await res.json()

console.log(todos)