const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const mongoUrl = `mongodb+srv://adrian_d6:${password}@cluster0.3z64f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(mongoUrl)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({})
    .then(person => {
        person.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}

if (process.argv.length > 3) {
    const person = new Person({
        name, 
        number
    })

    person.save().then(result => {
        console.log('Person saved!')
        mongoose.connection.close()
    })
}
