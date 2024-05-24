function main() {
    const btn = document.getElementById('btn')
    btn.addEventListener('click', sendMessage)
    getMessages()
}

async function sendMessage(evt) {
    evt.preventDefault()

    const text = document.getElementById('messageText')
    const from = document.getElementById('messageFrom')
    const m = {text, from}

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(m)
    }

    const res = await fetch('/api/message', options)
    const result = await res.json()
    if (result.data) {
        document.getElementById('messages').appendChild({
            text: result.data.text,
            from: result.data.from
        })
    } else {
        console.log('data was not saved :(')
    }
}

async function getMessages() {
    const res = await fetch('/api/messages')
    const messages = await res.json()

    const divs = messages.map(m => {
        const div = document.createElement('div')
        div.textContent = `${m.text} from ${m.from}`
        return div
    })

    document.getElementById('messages').append(...divs)
}

main()