const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:secret@localhost:5432/postgres');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 4000
app.listen(port, () => console.log(`app listening on port ${port}!`))



app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())



const Movie = sequelize.define('movie', {
  title: {
    type: Sequelize.STRING
  },
  yearOfRelease: {
    type: Sequelize.INTEGER
  },
  synopsis: {
    type: Sequelize.STRING
  }
});

sequelize.sync()
    .then(() => console.log('Tables created successfully'))
    .catch(err => {
        console.error('Unable to create tables, shutting down...', err);
        process.exit(1);
    })



// Create a new movie
app.post('/movie', (req, res, next) => {
  Movie.create(req.body)
      .then(movie => res.json(movie))
      .catch(err => next(err))
})

//get all movies
app.get('/movie', (req, res, next) => {
  if(Movie.length=0){
    res.send('No Movies Available')
  }
  const limit = req.query.limit || 5
  const offset = req.query.offset || 0

  Movie.findAndCountAll({ limit, offset })
    .then(result => res.send({ movies: result.rows, total: result.count }))
    .catch(error => next(error))
})

//get movie by id
app.get('/movie/:id', (req,res,next) => {
  if(!req.params.id > 0){
    res.status(404).end();
  }
Movie.findByPk(req.params.id)
  .then(movie => res.send(movie))
  .catch(next)
})

//update movie by id
app.put('/movie/:id', (req,res,next) => {
  if(!req.params.id > 0){
    res.status(404).end();
  }
Movie.findByPk(req.params.id)
  .then(movie => movie.update(req.body))
  .then(movie => res.send(movie))
  .catch(next)
})

//Delete movie by id
app.delete('/movie/:id', (req,res,next) => {
Movie.findByPk(req.params.id)
  .then(movie => movie.destroy())
  .then(movie => res.send(movie))
  .catch(next)
})