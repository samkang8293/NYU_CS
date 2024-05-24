import { useState, useEffect, useRef } from 'react'
import './App.css'

const App = () => {
    const [repos, setRepos] = useState([])
    const [url, setUrl] = useState(null)

    const usernameRef = useRef(null)

    useEffect(() => {
        let cancel = false

        const getRepos = async (url) => {
            const res = await fetch(url)
            const data = await res.json()
            if (!cancel) {
                setRepos(data)
            }
        }
        if (url) {
            getRepos(url)
        }

        return () => {
            cancel = true
        }
    }, [url])

    const handleClick = async (evt) => {
        const username = usernameRef.curent.value
        const url = `https://api.github.com/users/${username}/repos`
        console.log(url)

        setUrl(url)
    }

    const lis = repos.map(({name}) => {
        return <li key={name}>{name}</li>
    })
    return (
        <>
        <h1>repo browser</h1>
        <input type="text" ref={usernameRef} />
        <button onClick={handleClick}>getRepos</button>
        <ul>{lis}</ul>
        </>
    )
}

// const App = () => {
//     const [on, setOn] = useState(true)
//     const renderCount = useRef(1)
//     useEffect(() => {
//         renderCount.current += 1
//     })

//     const tog = evt => {
//         setOn(b => !b)
//     }
//     return (
//         <>
//         <h1>count: {renderCount.current}</h1>
//         <h2>{on ? 'on' : 'off'}</h2>
//         <button onClick={tog}>toggle</button>
//         </>
//     )
// }

// const App = () => {
//     const renderCount = useRef(1)
//     useEffect(() => {
//         renderCount.current += 1
//     })
//     return (
//         <h1>count: {renderCount.current}</h1>
//     )
// }

// render counter
// use state to this (spoiler: this won't work)
// useEffect w/ no dep array

// const App = () => {
//     const [renderCount, setRenderCount] = useState(0)
//     useEffect(() => {
//         setRenderCount(old => old + 1)
//         return (
//             <>
//             <h1>count: {renderCount}</h1>
//             </>
//         )
//     })
// }

// const App = () => {
//     const [chars, setChars] = useState([])
//     const exp = useRef(null)
//     const handleChange = evt => {
//         // this refers to a form input
//         // also use .value
//         setChars([...exp.current.value])
//     }

//     const stack = []
//     const spans = chars.map((ch, i) => {
//         let cls = ''
//         if (ch === '(') {
//             stack.push(ch)
//         } else if (ch === ')' && stack.length > 0) {
//             stack.pop()
//         } else if (ch === ')' && stack.length === 0) {
//             cls = 'unbalanced'
//         }
//         return <span className={cls} key={i}>{ch}</span>
//     })
//     return (
//         <>
//             <input ref={exp} onChange={handleChange} type="text" />
//             <output>{spans}</output>
//         </>
//     )
// }

// const App = () => {
//     const [exp, setExp] = useState('')
//     const handleChange = evt => {
//         setExp(evt.target.value)
//     }

//     return (
//         <>
//             <input onChange={handleChange} type="text" />
//             <output>{ex}</output>
//         </>
//     )
// }

/*
// we will use new state (url)
// to trigger useEffect (dep array [url])
// to set new state (url), we'll do this onClick
const App = () => {
    const [msg, setMsg] = useState('')
    const [url, setUrl] = useState(null)

    useEffect(() => {
        let cancel = false

        const getMsg = async (url) => {
            const res = await fetch(url)
            const data = await res.json()
            if (!cancel) {
                setMsg(data.msg)
            }
        }
        if (url) {
            getMsg(url)
        }

        return () => {
            cancel = true
        }
    }, [url])

    const handleClick = async (evt) => {
        const s = evt.target.className
        const url = 'http://localhost:3001/api/' + s
        console.log(url)

        setUrl(url)
    }
    return (
        <>
        <h1>m: {msg}</h1>
        <button className="regular" onClick={handleClick}>regular</button>
        <button className="delayed" onClick={handleClick}>delayed</button>
        </>
    )
}
*/

// const App = () => {
//     const [books, setBooks] = useState([])

//     useEffect(() => {
//         // we wrap are fetch so that we can use await
//         // useEffect's first arg, the func, can't be async
//         const getBooks = async (url) => {
//             const res = await fetch(url)
//             const data = await res.json()
//             // change state ... causes re-render
//             // inital books appear
//             setBooks(data)
//         }

//         getBooks('http://localhost:3001/api/books')
//     }, [])

//     const li = books.map(({title, _id}) => {
//         return <li key={_id}>{title}</li>
//     })

//     return (
//         <>
//         <h1>Books</h1>
//         <ul>{li}</ul>
//         </>
//     )
// }

export default App