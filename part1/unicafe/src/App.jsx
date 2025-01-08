import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
    
  )
}

const Statistics = (props) => {
  function calculateAverage() {
    return (props.good - props.bad) / (props.good + props.neutral + props.bad);
  }

  function calculatePositivePercentage() {
    return 100 * props.good / (props.good + props.neutral + props.bad);
  }
  
  return (
    <>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={props.good} />
          <StatisticLine text="neutral" value={props.neutral} />
          <StatisticLine text="bad" value={props.bad} />
          <StatisticLine text="average" value={calculateAverage()} />
          <StatisticLine text="positive" value={calculatePositivePercentage()} />
        </tbody>
      </table>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // How i handle state increment value in step 1 - 4
  function handleIncrementValue (value) {
    if (value === "good")
      setGood(good + 1)
    else if (value === "neutral")
      setNeutral(neutral + 1)
    else if (value === "bad")
      setBad(bad + 1)
    else
      console.log("Undefined value " + value)
  }

  function showStatistics () {
    if (good+neutral+bad > 0) 
      return <Statistics good={good} neutral={neutral} bad={bad}/>
    else {
      return (
        <p>No feedback given</p>
      )
    }
  }

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button text="good" onClick={() => setGood(good + 1)}/>
        <Button text="neutral" onClick={() => setNeutral(neutral + 1)}/>
        <Button text="bad" onClick={() => setBad(bad + 1)}/>
      </div>
      {showStatistics()}
      
    </div>
  )
}

export default App