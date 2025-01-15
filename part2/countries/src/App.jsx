import { useState, useEffect } from 'react'
import axios, { all } from 'axios'

import Country from './components/Country'
import Filter from './components/Filter'

/**
 * exercise 2.18 and 2.19 done here.
 * At the start we request all country data, and create an object that holds only the data
 * we care about (name, area, languages and flag). 
 * This is not the perfect solution since we required to have all data since the start, and
 * this is not a valid solution for the exercise 2.20
 */

function App() {
  // state vaariable that store all the countries names
  const [allCountries, setAllCountries] = useState(null)
  const [filterName, setFilterName] = useState('')

  const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'
  const maxCountries = 10 // this constant determines the number of countries the application will shown

   // when useEffect trigger get all contries from the url
  useEffect(() => {
    axios
      .get(`${baseUrl}/all`)
      .then(response => {
        setAllCountries(response.data.map(country => {
          return { // create a country object, get only the data we care
            name: country.name.common,
            area: country.area,
            capital: country.area,
            languages: country.languages,
            flags: country.flags, // png, svg, alt
            shown: false // This variable is used exercise 2.19
          }
        }))
      })
  }, [])

  function handleNameChange (event) {
    const name = event.currentTarget.value
    setFilterName(name)
  }

  function toggleShown(countryName) {
    const country = allCountries.find((country) => country.name === countryName)
    const changedCountry = {...country, shown: !country.shown}
    setAllCountries(allCountries.map(country => 
      country.name === countryName ? changedCountry : country
    ))
  }


  function showCountries() {
    if (allCountries === null) {
      return null
    }

    const countriesToShow = allCountries.filter(
      country => country.name.toLowerCase().includes(filterName.toLowerCase())
    )
    //console.log(countriesToShow.length)
    if (countriesToShow.length > maxCountries) {
      return <p>Too many matches, specify another filter</p>
    }

    return (
      countriesToShow.map(country => {
        return (
            <div key={country.name}>
                <Country country={country} toggleShown={toggleShown} />
            </div>
        )
      }))
  }

  return (
    <>
      <Filter filterName={filterName} handleNameChange={handleNameChange}/>
      {
        showCountries()
      }
    </>
  )
}

export default App
