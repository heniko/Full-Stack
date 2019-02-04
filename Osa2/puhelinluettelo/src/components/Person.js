import React from 'react'

const Person = ({ person, onClick }) => {
    return (
        <li>
            {person.name} {person.number}
            <button onClick={onClick}>poista</button>
        </li>
    )
}

export default Person