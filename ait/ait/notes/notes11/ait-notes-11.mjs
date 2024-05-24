import './config.mjs'
import mongoose from 'mongoose'

const MovieSchema = new mongoose.Schema({
    title: {required: true, type: String},
    director: {required: true, type: String},
    year: {required: true, type: Number, min: 0}
})
// lowercase plural is collection name
const Movie = mongoose.model('Movie', MovieSchema)

export {
    Movie
}

// Movie is a function that can be used as a constructor
// (think of it as class)
// Movie.find ... static method on class
// new Movie instantiates a movie object (we can persist to ducment in mongodb using .save)
// .save will return the actual saved instance

// try {
//     const m = new Movie({title: 'Dune Part One', year: 2021})

//     const savedMovie = await m.save()

//     console.log(savedMovie)
// } catch (e) {
//     console.log('u made an error')
// }



// const movies = await Movie.find({})

// console.log(movies)

/*
    validation at the database level
    * by default, no constraints
    * u can add constraints for mongodb
    
    validation 
*/
