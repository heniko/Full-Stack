import React from 'react'

const FilterForm = ({ value, onChange }) => {
    return (
        <div>
            rajaa näytettäviä: <input
                value={value}
                onChange={onChange}
            />
        </div>
    )
}

export default FilterForm