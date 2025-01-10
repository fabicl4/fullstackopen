import Part from "./Part"

const Content = ({course}) => {
    //console.log(props)

    // Rendering collection method
    const result = course.parts.map( part =>
        <Part key={part.id} part={part} />
    )

    return (
        <>
            {result}
        </>
    )
}

export default Content