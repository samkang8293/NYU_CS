const main = async () => {
    const btn = document.querySelector('button')
    btn.addEventListener('click', async function(evt) {
        const todoName = document.getElementById('todoName').value
        const options = {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({todoName})
        }
        const res = await fetch('http://localhost:3000/api/todos', options)
        const data = await res.json()
        console.log(data)
    })
    // const res = await fetch('http://localhost:3000/api/todos')
    // const data = await res.json()
    // const divs = data.data.map((s) => {
    //     const div = document.createElement('div')
    //     div.textContent = s
    //     return div
    // })
    
    // document.body.append(...divs)
}
main()