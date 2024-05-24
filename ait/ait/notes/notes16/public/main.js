document.addEventListener('DOMContentLoaded', main)

function main() {
    const btn = document.querySelector('input[type="submit"]')
    btn.addEventListener('click', handleClick)

    const ul = document.querySelector('.todoList')
    ul.addEventListener('click', handleUlClick)

    document.addEventListener('mousemove', function(evt) {
        console.log(evt.x, evt.y)
    })
}

function handleUlClick(evt) {
    console.log('ul was clicked')
}

function ele(name, text) {
    const e = document.createElement(name)
    e.textContent = text
    return e
}
function handleClick(evt){
    evt.preventDefault()
    const textInput = document.querySelector('input[type="text"]')
    const li = ele('li', textInput.value)
    li.addEventListener('click', markDone)
    const ul = document.querySelector('.todoList')
    ul.appendChild(li)
}
function markDone(evt) {
    // remove the li that was clicked on
    // which one was clicked?
    // this will refer to elemnt that caused event
    // make sure to avoid arrow functions so that thisis still accessible
    // this.remove()
    // alt is to use evt.target to ref ele that generated event
    // evt.target.remove()
    // evt.target.classList.add('done')
    evt.stopPropagation()
    evt.target.classList.toggle('done')
}