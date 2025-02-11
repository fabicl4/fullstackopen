import { useState, useEffect } from 'react'
import personsServices from './services/persons'

import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilterName, setNewFilterName] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => { // get data from the json-server
    //console.log('effect')

    personsServices
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, []) // dependency parameter

  console.log('render', persons.length, 'persons')

  //Note: newNumber is a string to be able to write number like 040-123456
  // In any case this value is check!

  function addPerson (event) {
    event.preventDefault();
    // exercise 2.7. Prevent the user from being able to add names that already exist in the phonebook.
    //Note: This app is case sensitive!!!
    const foundPerson = persons.find(personObj => personObj.name === newName)
    if (foundPerson) {
     // alert(`${newName} is already added to phonebook`)
      
      if (confirm(`${newName} is already to phonebook, replace the old number with the new one?`)) {
        const changedPerson = { ...foundPerson, number: newNumber}
        console.log("Updated person", changedPerson)
        
        personsServices
          .update(changedPerson.id, changedPerson)
          .then(returnedPerson => {
            // If we use json-server, a previouly deleted entry will trigger an exception
            // that it's not the case when using the actual database.
            // It returns a response with data equal to null.
            console.log("Returned by update ", returnedPerson)
            if (!returnedPerson) 
            {
              throw Error(`The entry ${changedPerson.name} does not exist!`)
            }

            setPersons(persons.map(p => p.id !== foundPerson.id ? p : returnedPerson))
            setNotificationMessage({
              message: `${changedPerson.name} number was changed!`,
              isError: false
            })
          }) // TODO: Multiple catch so it works either way!
          .catch(error => { // FIX: If we try to update to an unvalid number this be triggered!!!!
            // In a production build this catch it use for a invalid number!
            // In a development build this catch triggers if an entry is removed from the phonebook!
            // Invalid phone number! (400 bad request!)
            console.log(error.response)

            //`The person was already deleted from the phonebook ()
            setNotificationMessage({
              message: `Information of ${foundPerson.name} has already been removed from the server`,
              isError: true
            })
            setPersons(persons.filter(p => p.id !== foundPerson.id))
          })
          
      }
      // else do nothing
    }
    else {
      // create the new person
      const personObj = {
        name: newName,
        number: newNumber,
        //id: 
      }

      personsServices
        .create(personObj)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNotificationMessage({
            message: `Added ${personObj.name}`,
            isError:false
          })
        })
        .catch(error => {
          // Unvalid person name and number.
          console.log(error.response.data.error)
          /*
          setNotificationMessage({
            message: "...",
            isError: true
          })
          */
        }) 
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

  // exercise 2.14
  // delete an entry from the phonebook
  function handleDelete (person) {
    if (confirm(`Delete ${person.name}?`)) { // user confirms he/she wants to delete an entry from the phonebook
      personsServices
        .remove(person.id)
        .then (result => {
          console.log(result)
          // Note: we could make a new getAll request, instead i create a new array of persons where that entry does not exists!
          setPersons(persons.filter(p => p.id !== person.id))
        })
        .catch(error => { // If we try to delete an entry that already has been removed, it will cause an error.
          setNotificationMessage({
            message: `Cannot remove ${person.name}, he/she has already been removed from the server`,
            isError: true
          })
          setPersons(persons.filter(p => p.id !== person.id))
          //console.log(error)
        })
    }
    // If the user doesnt confirm, then do nothing!
    
  }

  const personToShow = (newFilterName === '')
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newFilterName.toLowerCase()))

  //console.log(personToShow)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notificationMessage} />
      <Filter filterName={newFilterName} handleFilterNameChange={handleFilterNameChange}/>
      <h2>add a new</h2>
      <PersonForm
        addPerson={addPerson}
        valueName={newName} handleNameChange={handleNameChange}
        valueNumber={newNumber} handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personToShow} handleDelete={handleDelete}/>
    </div>
  )
}

export default App