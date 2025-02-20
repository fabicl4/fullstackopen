const express = require('express')
const app = express()
require('dotenv').config({path:'./variables.env'})

app.use(express.static('dist'))

const Person = require('./models/person')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name == "CastError") {
    return response.status(400).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(requestLogger)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

var morgan = require('morgan')
//app.use(morgan('combined'))

morgan.token('content', function (req, res) {
    //console.log('logger: ', req.body)
    return JSON.stringify(req.body)
})

app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens['content'](req, res)
    ].join(' ')
  }))

// Get all
app.get('/api/persons', (request, response) => {
    //response.json(persons)
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
      const date = new Date();
      response.send(
        `<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`
      )
    })
})

// Get phonebook entry by id
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error))
  })

app.delete('/api/persons/:id', (request, response, next) => {
    // This function does not delete an entry from the database
    // 3.15-3.16 update.
    Person.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })

app.post('/api/persons', (request, response, next) => {
    const body = request.body
  
    // check if values missing
    if (!body.name || !body.number) {
        console.log("name or number is missing")
        return response.status(400).json({ 
            error: 'name or number is missing' 
        })
    }

    // 3.12 ignore whether there is already a person in the database with the same name as the person you are adding
    const person = new Person({
      name: body.name,
      number: body.number,
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  
  const {name, number} = request.body

  // 3.15-3.16 update.
  Person.findByIdAndUpdate(
    request.params.id, 
    {name, number}, 
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})