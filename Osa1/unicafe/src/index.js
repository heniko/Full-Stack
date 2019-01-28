import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = (props) => {
    return (
        <button onClick={props.action}>
            {props.text}
        </button>
    )
}

const Statistic = (props) => {
    return (
        <tr>
            <td>{props.name}</td>
            <td>{props.stat} {props.end}</td>
        </tr>
    )
}

const Statistics = (props) => {
    if (props.good + props.neutral + props.bad === 0) {
        return (
            <p>Ei yhtään palautetta annettu</p>
        )
    }
    return (
        <table>
            <tbody>
                <Statistic name="hyvä" stat={props.good} />
                <Statistic name="neutraali" stat={props.neutral} />
                <Statistic name="bad" stat={props.bad} />
                <Statistic name="keskiarvo" stat={((props.good - props.bad) / (props.good + props.neutral + props.bad)).toFixed(2)} />
                <Statistic name="positiivisia" stat={((props.good / (props.good + props.neutral + props.bad)) * 100).toFixed(2)} end="%" />
            </tbody>
        </table>
    )
}

const App = () => {
    // tallenna napit omaan tilaansa
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    const handleGood = () =>
        setGood(good + 1)

    const handleNeutral = () =>
        setNeutral(neutral + 1)

    const handleBad = () =>
        setBad(bad + 1)

    return (
        <div>
            <h1>anna palautetta</h1>
            <Button action={handleGood} text="hyvä" />
            <Button action={handleNeutral} text="neutraali" />
            <Button action={handleBad} text="huono" />
            <h1>statistiikka</h1>
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    )
}

ReactDOM.render(<App />,
    document.getElementById('root')
)