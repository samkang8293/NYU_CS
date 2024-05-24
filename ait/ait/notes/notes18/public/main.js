const ul = document.querySelector('ul')

const res = await fetch('/api/todos')
const data = await res.json()
const lis = data.map(todo => {
    const li = document.createElement('li')
    li.textContent = todo.name
    return li
})

ul.append(...li)