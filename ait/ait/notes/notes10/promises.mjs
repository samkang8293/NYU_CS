const p = new Promise((fulfill, reject) => {
    fulfill(1)
})

const p2 = p.then(val => {
    console.log(val)

    return 2 // this will get wrapped in an immediately fulfilled promise
    /*
    return new Promise((fulfill, reject) => {
        fulfill(2)
    }) // this will be returned by then
    */
    // we can return something
    // what we return here
    // is return by then
    // (then always returns a promise)
})

p2.then(console.log)
/*
// a new promise takes a single argument
// a function that excutes an async task (eg db write)
const p = new Promise((fulfill, reject) => {
    // we do something async
    // ... at some point it succeeds!
    // because of this, we can call fulfill (with result of async task)

    fulfill('hello')
    reject('uh oh')
})

// then can set what fulfill and reject are
// then always returns a promise
// consequently, you may see .then chained
p.then((val) => {
    console.log('success', val)
}, (err) => {
    console.log('Error!!!!', err)
})

/* 
fetch(url) --> p1
    .then(res => res.json()) set the fulfill and reject of p1 ... then returns a new promise, p2
    .then(data => console.log(data)) ... will set fulfill and reject p2

*/
