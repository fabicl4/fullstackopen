export default function Country ({country}) {
    console.log(country)
    /*
    <ul>
                {country.languages.map(({key, value}) => {
                    <li key={key}>{value}</li>
                })}
            </ul>
    */

    return (
        <>
            <h1>{country.common}</h1>
            <p>capital {country.capital}</p>
            <b>languages:</b>
            
        </>
    )
}