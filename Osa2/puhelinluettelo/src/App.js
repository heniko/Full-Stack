import React, { useState, useEffect } from 'react'
import Person from './components/Person'
import FilterForm from './components/FilterForm'
import NewPersonForm from './components/NewPersonForm'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [personFilter, setPersonFilter] = useState('')
    const [notification, setNotification] = useState(null)

    useEffect(() => {
        personService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
            })
    }, [])

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handlePersonFilterChange = (event) => {
        setPersonFilter(event.target.value)
    }

    const newNotification = message => {
        setNotification(
            message
        )
        setTimeout(() => {
            setNotification(null)
        }, 5000)
    }

    const addPerson = (event) => {
        event.preventDefault()

        if (persons.filter(person => person.name === newName).length > 0) {
            if (window.confirm(`Päivitetäänkö yhteystieto '${newName}'`)) {
                const oldPerson = persons.find(person => person.name === newName)
                const updatedPerson = {
                    name: newName,
                    number: newNumber,
                    id: oldPerson.id
                }
                personService
                    .update(oldPerson.id, updatedPerson)
                    .then(res => {
                        setPersons(persons.map(person => person.id !== res.id ? person : res))
                        newNotification(`Yhteystieto '${res.name}' päivitetty`)
                        setNewName('')
                        setNewNumber('')
                    })
                    .catch(error => {
                        alert(`Yhteystieto '${oldPerson.name}' on jo poistettu palvelimelta`)
                        setPersons(persons.filter(person => person.id !== oldPerson.id))
                    })
            }
        } else {
            const personObject = {
                name: newName,
                number: newNumber
            }
            personService
                .create(personObject)
                .then(res => {
                    setPersons(persons.concat(res))
                    newNotification(`Yhteystieto '${res.name}' lisätty`)
                    setNewName('')
                    setNewNumber('')
                })
        }
    }

    const deletePerson = id => {
        const person = persons.find(person => person.id === id)
        if (window.confirm(`Poistetaanko ${person.name}?`)) {
            personService.deletePerson(id).then(res => {
                setPersons(persons.filter(person => person.id !== id))
                newNotification(`Yhteystieto '${person.name}' poistettu`)
            }).catch(error => {
                alert(`Yhteystieto '${person.name}' on jo poistettu palvelimelta`)
                setPersons(persons.filter(person => person.id !== id))
            })

        }
    }

    const personsToShow = () =>
        persons.filter(person => person.name.toUpperCase().includes(personFilter.toUpperCase()))

    const rows = () =>
        personsToShow().map(person =>
            <Person
                key={person.id}
                person={person}
                onClick={() => deletePerson(person.id)}
            />
        )

    return (
        <div>
            <h2>Puhelinluettelo</h2>
            <Notification message={notification} />
            <FilterForm value={personFilter} onChange={handlePersonFilterChange} />
            <h2>lisää uusi</h2>
            <NewPersonForm
                newName={newName}
                newNumber={newNumber}
                handleNumberChange={handleNumberChange}
                handleNameChange={handleNameChange}
                onSubmit={addPerson}
            />
            <h2>Numerot</h2>
            <ul>
                {rows()}
            </ul>
        </div>
    )
}

export default App