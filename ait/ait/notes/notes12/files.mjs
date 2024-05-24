// all imports should be in order to run correctly, .env should be in same folder
import './config.mjs'
import './other.mjs'

// we are reimplementing fs/promises version of readFile with our own diy version
// import { readFile } from 'fs'

// const myReadFile = fileName => {
//     return new Promise((fulfill, reject) => {
//         readFile(fileName, (err, data) => {
//             if (err) {
//                 reject(err)
//             } else {
//                 fulfill(data)
//             }
//         })
//     })
// }

// const data = await myReadFile('./notes.md') // to make sure code goes sequentially, use await
// console.log(data)
// console.log('DONE')
// console.log('REALLY DONE')

// u can use await
// 1. top level (outside of func)
// 2. within a func that's declared as async

// const p = myReadFile('./notes.md')
// p.then(val => {
//     console.log(val)
//     console.log('DONE')
// })
// console.log('REALLY DONE')
// const p = new Promise((fulfill, reject) => {
//     /// do stuff that's prob async or comp expensive
//     // fulfill('this is data we read from database') // we did it! it worked!
//     // reject('could not connect to db')
//     fulfill('first')
// }) // promise constructor, does something async when call
// const p2 = p.then((val) => {
//     console.log('fulfilled with: ', val)
//     return new Promise((fulfill, reject) => {
//         fulfill('second')
//     })
// }) // take first arg of then and run fulfill
// p2.then(console.log)
// import { readFile } from 'fs/promises'

// const p = readFile('./notes.md') // NO callback! WE HAZ return value!
// p.then(console.log)

// readFile(fn) --> Promise

// readFile(fr, cb) --> undefined

// import { readFile } from 'fs'

// readFile('./notes.md', (err, data) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log(data)
//     } // all these excutes first, and calls 'DONE' after reading data
//     console.log('DONE')
// })
// // if placed here, 'DONE' called first because not have to read data with 'DONE'