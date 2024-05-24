import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])

  useEffect(() => {
    const getTodos = async (url) => {
      const res = await fetch(url)
      const data = await res.json()

      setTodos(data.data)
    }
    getTodos('http://localhost:3000/api/todos')
  }, [])

  const divs = todos.map(t => {
    return <div key={t}>{t}</div>
  })

  return (
    <>
      <input placeholder="todo name" type="text" id="todoName" name="" value="" />
      <button>add todo</button>
      {divs}
    </>
  )
}

export default App
