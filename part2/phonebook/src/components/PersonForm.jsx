export default function PersonForm (props) {
    
    return (
        <form onSubmit={props.addPerson}>
            <div>
                name: <input value={props.valueName} onChange={props.handleNameChange}/>
            </div>
            <div>
                number: <input value={props.valueNumber} onChange={props.handleNumberChange}/>
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}