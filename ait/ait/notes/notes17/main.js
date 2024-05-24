const btn = document.querySelector('input[type="submit"]')
btn.addEventListener('click', getRepos)

async function getRepos(evt) {
    evt.preventDefault()
    const usernameInput = document.querySelector('input[type="text"]')
    console.log(usernameInput.value)

    const url = `https://api.github.com/users/${usernameInput.value}/repos`
    const res = await fetch(url)
    const data = await res.json()
    console.log(data)
    const divs = data.map(repo => {
        const div = document.createElement('div')
        div.textContent = repo.name
        return div
    })
    document.body.append(...divs)
}
console.log(btn)