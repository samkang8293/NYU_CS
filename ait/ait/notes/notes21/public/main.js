import {io} from '/socket.io/socket.io.esm.min.js'
// this connects to socket.io server
const socket = io()

document.addEventListener('mousemove', function(evt) {
    socket.emit('mouse', {x: evt.x, y: evt.y})
})

socket.on('mouse', data => {
    let div = document.getElementById(data.id)
    if (!div) {
        div = document.createElement('div')
        div.textContent = data.id
        div.id = data.id
        div.style.position = 'fixed'
        document.body.appendChild(div)
    }
    div.style.left = data.x + 'px'
    div.style.top = data.y + 'px'
})