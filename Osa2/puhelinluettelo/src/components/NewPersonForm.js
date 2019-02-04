import React from 'react'

const NewPersonForm = ({newName, newNumber, onSubmit, handleNumberChange, handleNameChange}) => {
    return (
        <div>
            <form onSubmit={onSubmit}>
                <div>
                    nimi: <input
                        value={newName}
                        onChange={handleNameChange}
                    />
                    <br />
                    numero: <input
                        value={newNumber}
                        onChange={handleNumberChange}
                    />
                </div>
                <div>
                    <button type="submit">lisää</button>
                </div>
            </form>
        </div>
    )
}

export default NewPersonForm