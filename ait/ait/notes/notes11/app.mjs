import './config.mjs'
import './ait-notes-11.mjs'
import express from 'express'
import './ait-notes-11.mjs'
const app = express()

app.set('view engine', 'hbs')
app.use(express.urlencoded({extended: false}))

app.get('/movies/add', (req, res) => {
    res.render('movieForm', {})
})

// req.params will have your paths within an object based on string following the :
app.get('movie/:title/', async (req, res) => {
    // TODO: sanitize
    const title = req.params.title
    const movie = await Movie.findOne({title})
    res.render('movie', {movie})
})

app.post('/movies/add', async (req, res) => {
    try {
        const {title, director, year} = req.body
        const m = new Movie({title, director, year})
        const result = await m.save()
        res.redirect('/movies')
    } catch(e) {
        console.log(e)
        res.render('movieForm', {error: 'bad input'})
    }
    
})

app.listen(3000)