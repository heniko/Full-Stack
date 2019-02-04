import React from 'react'

const Content = ({ parts }) => {
    return (
        <div>
            {parts.map(part => <p key={part.id}>{part.name} {part.exercises}</p>)}
        </div>
    )
}

const Total = ({ parts }) => {
    const total = parts.reduce(function (acc, obj) { return acc + obj.exercises }, 0)
    return (
        <p>yhteensä {total} tehtävää</p>
    )
}

const Course = ({ course }) => {
    return (
        <div>
            <h1>{course.name}</h1>
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

export default Course