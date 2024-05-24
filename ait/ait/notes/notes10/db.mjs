// mongodb ---> databases ---> collections ---> documents
// mongoose
//              ^^^^^     ----> Schema/Model ---> objects/instances
import './config.mjs'
import mongoose from 'mongoose'
// connect
// dsn - data source name
// mongodb://usernamelocalhost
// ^^^^^^ belongs .env
console.log('connecting to', process.env.DSN)
mongoose.connect(process.env.DSN)

const CatSchema = new mongoose.SchemaType({
    name: String,
    lives: {type: Number, required: true}
})

// create constructor and collection for cats
// convention: collection is lowered plural

// API for mongoose
// all async func ... return a promise
const Cat = mongoose.model('Cat', CatSchema)
// can do below of Cat
// const Cat = mongoose.model('Cat')

const cats = await Cat.find({
})
console.log(cats)

/*
const c = new Cat({
    name: 'Garfield',
    lives: 9
})

const result = await c.save()
console.log(result)
*/