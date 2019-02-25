import React from 'react'

const LoginForm = ({
  handleSubmit,
  username,
  password
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h2>log in to application</h2>
        käyttäjätunnus
        <input {...username.field} />
      </div>
      <div>
        salasana
        <input {...password.field} />
      </div>
      <button type="submit">kirjaudu</button>
    </form>
  )
}

export default LoginForm