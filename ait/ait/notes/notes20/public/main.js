// 
let lastSentDate

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
    let url = 'http://localhost:3000/api/messages'

    if (lastSentDate) {
        url += '?lastSentDate=' + lastSentDate
    }
    const res = await fetch('/api/messages')
    const messages = await res.json()

    const divs = messages.map(m => {
        const div = document.createElement('div')
        div.textContent = `${m.text} from ${m.from}`
        return div
    })

    // if receive messages then set last sent date
    if (messages.length > 0) {
        lastSentDate = messages[messages.length - 1].sent
    }

    document.getElementById('messages').append(...divs)

    setTimeout(getMessages, 1000)
}

main()