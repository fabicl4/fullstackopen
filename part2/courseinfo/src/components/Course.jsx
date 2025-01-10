import Header from "./Header"
import Content from "./Content"
import Total from "./Total"

//Note: All Course components can be place in this module but i prefered put each one in its own module

export default function Course ({course}) {
    return (
        <>
          <Header course={course} />
          <Content course={course} />
          <Total course={course} />
        </>
      )
}