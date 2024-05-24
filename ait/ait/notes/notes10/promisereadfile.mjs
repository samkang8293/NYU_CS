import { readFile } from 'fs'

// we'll create our own readfile
// but it won't use a callback, it'll have a return value
// (in its implementation, we'll use the old cb based readfile)

const myReadFile = (path) => {
    return new Promise((fulfill, reject) => {
        // use cb version
        readFile(path, 'utf8', (err, data) => {
            if (!err) {
                fulfill(data)
            } else {
                reject(err)
            }
        })
    })
}

// blocks until promise fulfilled
// value that promise is fulfilled with
// is used to replace expression below
const s = await myReadFile('./notes.md')
console.log(s)
console.log('END')

/*

const main = async () => {
    const s = await myReadFile('./notes.md')
    console.log(s)
    console.log('END')
}
await main()
console.log('AFTER MAIN')

*/

/*
const p = myReadFile('./notes.md')
p.then(console.log)
console.log('END')
*/