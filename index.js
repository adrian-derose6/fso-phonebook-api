const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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

app.get('/api/persons', (request, response) => {
  console.log(persons)
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const { id } = request.params
  const person = persons.find(person => person.id === id)

  if (!person) {
    return response.status(404).json({
      error: `Person with id ${id} not found`
    })
  }
  
  response.json(person)
})

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({
      error: 'Name or number missing'
    })
  } 

  const nameExists = persons.find(person => person.name === name)
  if (Boolean(nameExists)) {
    return res.status(400).json({
      error: 'Name must be unique'
    })
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000).toString(),
    name, 
    number
  }

  persons = persons.concat(newPerson);
  res.status(201).json(newPerson)
})

app.get('/info', (request, response) => {
  const numberOfPersons = persons.length;
  const reqTime = new Date(Date.now()).toUTCString()

  response.send(`
    <div>
      <p>Phonebook has info for ${numberOfPersons}</p>
      <p>${reqTime}</p>
    </div>`)
})

app.delete('/api/persons/:id', (request, response) => {
  const { id } = request.params
  const person = persons.find(person => person.id == id)

  if (!person) {
    return response.status(404).send(`Could not find person with id ${person.id}`)
  }

  persons = persons.filter(person => person.id !== id)
  response.status(204).send(`${person.name} has been deleted`)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
