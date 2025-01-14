import { useState, useEffect } from 'react'
import axios from 'axios'
import Country from './components/Country'

function App() {
  const [allCountries, setAllCountries] = useState(null)
  const [filterName, setFilterName] = useState('')

  const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

  //console.log("number of countries", allCountries.length)

  // when useEffect trigger get all contries from the url
  useEffect(() => {
    axios
      .get(`${baseUrl}/all`)
      .then(response => {
        setAllCountries(response.data.map(country => {
          return { // create a country object, get only the data we care
            name: country.name.common,
            capital: country.area,
            languages: country.languages,
            flags: country.flags // png, svg, alt
          }
        }))
      })
  }, [])

  function handleNameChange (event) {
    const countryName = event.currentTarget.value
    setFilterName(countryName)
  }

  function showCountries () {
    // check if the list is longer than 10
    //console.log(countries.length)

    const filterCountries = allCountries.filter(country => country.name.toLowerCase().includes(filterName))

    if (filterCountries.length === 1)
    { // only one result
      //console.log(filterCountries[0])
      return (<Country country={filterCountries[0]} />)
    }
    else if (filterCountries.length <= 10) { // between 2 and 10 results
      return filterCountries.map(country => {
        return (
          <p key={country.name}>{country.name}</p>
        )
      })
    }
    else if (filterCountries.length > 10) {
      return (
        <p>Too many matches, specify another filter</p>
      )
    }
    else {
      return null
    }
  }

  return (
    <>
    <form>
      <div>
        find countries: <input value={filterName} onChange={handleNameChange}/>
      </div>
    </form>
    { allCountries &&
      showCountries()
      //JSON.stringify(countries, null, 10)
    }
    </>
  )
}

export default App
