export default function Filter (props) {
    return (
        <form>
            <div>
            find countries: <input value={props.filterName} onChange={props.handleNameChange}/>
            </div>
      </form>
    )
}