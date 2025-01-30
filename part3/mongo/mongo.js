/* 
    Exercise 3.12
*/

const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Error number of arguments!')
    process.exit(1)
}

/*
const url = process.env.MONGODB_URI;
*/

const password = process.argv[2]

const url = 
    `mongodb+srv://fcondelafuente:${password}@cluster0.qr5q0.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})
  
const Person = mongoose.model('Person', personSchema)

// less than 5 arguments
if (process.argv.length < 5) {
    // Find all results
    Person.find({}).then(result => {
        console.log("phonebook:")
        result.forEach(note => {
          console.log(`${note.name} ${note.number}`)
        })
        mongoose.connection.close()
      })

}
else
{
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        console.log(result)
        mongoose.connection.close()
    })
}

