export default function Persons({persons, handleDelete}) {
    //Note: It's better to generate an id instead of using the index. In this case,
    // since we are not deleting any element, it's good enough.
    // In this case, as said in exercise 2.6, we're using the person's name as a value of the key property
    // In exercise 2.7, we prevent the user from adding two or more times the same name!!
    const result = persons.map(person => {
        //console.log(person)
        return (
            <div key={person.id}>
                <p>{person.name} {person.number}</p>
                <button onClick={() => handleDelete(person)}>delete</button>
            </div>
        )
    })

    return (
        <>
        {result}
        </>
    )
} 