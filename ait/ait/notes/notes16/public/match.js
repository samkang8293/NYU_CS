const emoji = ['🖕', '😂', '👌', '😭'].map(e => [e, e]).flat()
const shuffle = arr => {
    for (let i = arr.length -1; i>0; i--) {
        const j = Math.floor(Math.random()*(i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
}
const ele = (name, text) => {
    const e = document.createElement(name)
    e.textContent = text
    return e
}
shuffle(emoji)

const divs = emoji.map(e => ele('div', e))

console.log(divs)

const container = document.createElement('div')
container.className = 'container'
container.style.width = '200px';

container.append(...divs)

document.body.appendChild(container)
// const divs = emoji.map()