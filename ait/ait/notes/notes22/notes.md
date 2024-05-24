## socket.io solution
``` javascript
// in app.mjs
import express from 'express'

const app = express()

import url from 'url'
import path from 'path'
const __dirname = path.join()

const gameState = {
    'player1': 0,
    'player2': 50
}

const DELTA = 5

io.on('connection', socket => {
    console.log(socket.id, 'has connected')
    // as soon as we get connection, send game data
    
    // send only to person that just connected
    socket.emit('update', gameState)

    socket.on('press', data => {
        console.log('got press', data)
        gameState[data] += DELTA
        io.emit('update', game)
    })
    socket.on('theme', data => {
        io.emit('theme', data)
    })
})
```

``` javascript
// racer.js
import { io } from '/socket.io/socket.io.esm.min.js'
const socket = io()

const player1Btn = document.querySelector('.player1Btn')
const player2Btn = document.querySelector('.player2Btn')

const player1 = document.getElementsByClassName('player1')[0]

const player2 = document.querySelector('.player2')
player1.style.position = 'relative'
player2.style.position = 'relative'

const select = document.querySelector('select')
select.addEventListener('input', changeTheme)

socket.on('update', gameState => {
    console.log('received update event:', gameState)
    player1.style.left = gameState.player1 + 'px'
    player2.style.left = gameState.player2 + 'px'
})

socket.on('theme', theme => {
    if (theme === 'dark') {
        document.body.style.backgroundColor = 'gray'
    }
})

function sendButtonPress(evt) {
    // evt.targer is element that produced event
    socket.emit('press', evt.target.className.replace('Btn', ''))
}

function changeTheme(evt) {
    // this is also element that produced event
    socket.emit('theme', this.value)
}
```

``` javascript
// practice DOM quiz
function main() {
    const input = document.querySelector('input)
    input.addEventListener('input', handleInput)
}

function handleInput(evt) {
    console.log(evt.target.value)
    const container = document.querySelector('#container')
    container.textContent = ''
    const stack = []

    const arr = [...evt.target.value]
    const spans = arr.map(ch => {
        const span = document.createElement('span')
        
        span.textContent = ch
        if (ch === '(') {
            stack.push(ch)
        } else if (ch === ')' && stack.length === 0) {
            span.classList.add('unbalanced')
        } else if (ch === ')' && stack.length >0) {
            stack.pop()
        }
        return span
    })

    document.querySelector('#container').append(...spans)
}
```

### React
backend
* express

frontend
* 

react
* 

``` javascript
const root = ReactDOM.createRoot(document.getElementById('roo'))
// compiled: root.render(React.createElement('div', {className: 'foo'}, 'hello'))

root.render(<div className='foo'>hello</div>)
```