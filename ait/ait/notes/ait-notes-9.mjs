import express from 'express'

const app = express()

app.set('view engine', 'hbs')

app.get('/complaints/add', (req, res) => {
    res.render('complaintForm', {})
})

