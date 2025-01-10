const Total = ({course}) => {

    const result = course.parts.reduce(
        (accumulator, currentValue) => accumulator + currentValue.exercises,
        0 // initial value
    )

    return (
        <b>total of {result} exercises</b>
    )
}

export default Total