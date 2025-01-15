export default function Country ({country, toggleShown}) {
    //console.log(country)

    return (
        <>
        <p>{country.name}</p>
        <button onClick={() => toggleShown(country.name)}>{country.shown ? 'hide' : 'show'}</button>
            {country.shown &&
                (<>
                    <h1>{country.name}</h1>
                    <p>capital {country.capital}</p>
                    <p>area {country.area}</p>
                    <b>languages:</b>
                    <ul>
                        {
                            Object.values(country.languages).map(language => {
                                return <li key={language}>{language}</li>
                            })
                        }
                    </ul>
                    <img src={country.flags.svg} alt={country.flags.alt} width={100}/>
                </>)
            }
        </>
    )
}