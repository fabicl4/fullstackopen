export default function Filter (props) {
    return (
        <form> 
            <div>
                filter shown with <input value={props.filterName} onChange={props.handleFilterNameChange}/>
            </div>
        </form>
    )
}