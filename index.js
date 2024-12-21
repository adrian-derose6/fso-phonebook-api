const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

morgan.token('body', (req, res, body) => {
  return JSON.stringify(req.body);
})

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    console.log(persons)
    res.json(persons)
  }).catch(error => {
    console.log(error)
    res.status(500).json({ message: 'Error getting persons' })
  })
})

app.get('/api/persons/:id', (req, res) => {
  const { id } = req.params
  Person.findById(id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).json({
        message: 'Person not found'
      })
    }
    
  }).catch(error => {
    console.log(error)
    res.status(500).json({ message: 'Error fetching person', error })
  })
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({
      message: 'Name or number missing'
    })
  } 

  const existingPersons = Person.find({ name }).then(persons => {
    console.log(persons)
    return persons;
  }).catch(error => {
    console.log(error)
    res.status(500).json({ message: 'Error fetching matching persons', error})
  })  

  if (existingPersons.length > 0) {
    return res.status(400).json({
      message: 'Name must be unique'
    })
  }

  const person = new Person({
    name, 
    number
  })

  person.save().then(savedPerson => {
    res.status(201).json(savedPerson)
  }).catch(error => {
    console.log(error)
    res.status(500).json({
      message: 'Error saving new person',
      error
    })
  })
})

app.get('/info', (req, res) => {
  const numberOfPersons = Person.find({}).then(persons => persons.length)
  const reqTime = new Date(Date.now()).toUTCString()

  res.send(`
    <div>
      <p>Phonebook has info for ${numberOfPersons}</p>
      <p>${reqTime}</p>
    </div>`)
})

app.delete('/api/persons/:id', (req, res) => {
  const { id } = req.params
  
  Person.findByIdAndDelete(id).then(deletedPerson => {
    if (deletedPerson) {
      res.json({ message: `${deletedPerson.name} has been deleted`, data: deletedPerson })
    } else {
      res.status(404).json({ message: 'Person not found' })
    }
  }).catch(err => {
    console.log(error)
    res.status(500).json({ message: 'Error deleting person', error })
  })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
