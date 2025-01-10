import { useState, useEffect } from 'react'
import axios from 'axios'

import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilterName, setNewFilterName] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, []) // dependency parameter
  console.log('render', persons.length, 'persons')

  //Note: newNumber is a string to be able to write number like 040-123456
  // In any case this value is check!

  // Debug: elements in person
  //console.log(persons)

  function addPerson (event) {
    event.preventDefault();

    // exercise 2.7. Prevent the user from being able to add names that already exist in the phonebook.
    
    //Note: This app is case sensitive!!!
    const found = persons.find(personObj => personObj.name === newName)
    if (found) {
      alert(`${newName} is already to phonebook!`)
    }
    else {
      const personObj = {
        name: newName,
        number: newNumber,
        //id: 
      }
      //console.log(personObj.name)
      setPersons(persons.concat(personObj))
    }

    setNewName('')
    setNewNumber('')
  }

  function handleNameChange(event) {
    // this function will be trigger each time we change the name on the input tag
    // this will trigger render the component each time!!!!
    setNewName(event.currentTarget.value)
  }

  function handleNumberChange(event) {
    // same as handleNameChange
    setNewNumber(event.currentTarget.value)
  }

  // exercise 2.9 The filtering logic shown in the image is case insensitive!
  function handleFilterNameChange(event) {
    // this function will be trigger each time we change the name on the input tag
    // this will trigger render the component each time!!!!
    setNewFilterName(event.currentTarget.value)
  }

  const personToShow = (newFilterName === '')
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newFilterName.toLowerCase()))

  //console.log(personToShow)

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterName={newFilterName} handleFilterNameChange={handleFilterNameChange}/>
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        valueName={newName} handleNameChange={handleNameChange}
        valueNumber={newNumber} handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personToShow} />
    </div>
  )
}

export default App