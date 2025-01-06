const Header = (props) => {
    console.log(props) // exercises 1.3
    return (
        <h1>{props.course.name}</h1>
    )
}

export default Header