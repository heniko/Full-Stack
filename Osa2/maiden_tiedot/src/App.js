import React, { useState, useEffect } from 'react';
import countriesService from './services/countries'

const Country = ({ country }) => {
    if (country === null) {
        return (
            <div></div>
        )
    }
    return (
        <div>
            <h2>
                {country.name}
            </h2>
            <p>
                Capital {country.capital}
            </p>
            <p>
                Population {country.population}
            </p>
            <img height="200" src={country.flag} />
            <h3>
                Languages
            </h3>
            <ul>
                {country.languages.map(l => <li key={l.name}>{l.name}</li>)}
            </ul>
        </div>
    )
}

const ListCountry = ({ country, onClick }) => {
    return (
        <li>
            {country.name}
            <button onClick={onClick}>show</button>
        </li>
    )
}

const App = () => {
    const [countries, setCountries] = useState([])
    const [filter, setFilter] = useState('')
    const [countryToShow, setCountryToShow] = useState(null)
    const [countriesToShow, setCountriesToShow] = useState([])
    const [message, setMessage] = useState('Too many results')

    useEffect(() => {
        countriesService
            .getAll()
            .then(res => {
                setCountries(res)
            })
    }, [])

    const handleFilterChange = (event) => {
        setFilter(event.target.value)
        const filteredCountries = countries.filter(c => c.name.toUpperCase().includes(event.target.value.toUpperCase()))
        if (filteredCountries.length > 10) {
            setMessage('Too many results')
            setCountriesToShow([])
            setCountryToShow(null)
        } else if (filteredCountries.length > 1) {
            setCountriesToShow(filteredCountries)
            setMessage('')
            setCountryToShow(null)
        } else if (filteredCountries.length === 1) {
            setCountryToShow(filteredCountries[0])
            setCountriesToShow([])
            setMessage('')
        } else {
            setCountriesToShow([])
            setCountryToShow(null)
            setMessage('No results')
        }
    }

    const selectCountry = numericCode => {
        setMessage('')
        setCountryToShow(countries.filter(c => c.numericCode === numericCode)[0])
        setCountriesToShow([])
    }

    return (
        <div>
            find countries: <input
                value={filter}
                onChange={handleFilterChange}
            />
            <p>{message}</p>
            <Country country={countryToShow} />
            <ul>
                {countriesToShow.map(c =>
                    <ListCountry key={c.numericCode}
                        country={c}
                        onClick={() => selectCountry(c.numericCode)}
                    />
                )}
            </ul>
        </div>
    )
}

export default App