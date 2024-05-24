import { io } from '/socket.io/socket.io.esm.min.js'

const socket = io()

const btn = document.querySelector("#btn")
btn.addEventListener("click", sendMessage)

function sendMessage(evt) {
    const text = document.querySelector('#messageText').value
    const from = document.querySelector('#messageFrom').value

    socket.emit()
}

socket.on('chat', data => {
    const div = document.createElement('div')
    div.textContent = data.message + ' from ' + data.from
    document.body
})