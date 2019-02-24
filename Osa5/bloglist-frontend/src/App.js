import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setAsSortedBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState({
    message: null,
    type: null
  })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  })

  const notify = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null }), 5000)
  }

  const setBlogs = (unsorted) => {
    const sorted = unsorted.sort((a, b) => {
      return b.likes - a.likes
    })
    setAsSortedBlogs(sorted)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (e) {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogAppUser')
      setUser(null)
      notify('logged out successfully', 'notification')
    } catch (e) {

    }
  }

  const newBlog = async (event) => {
    event.preventDefault()
    const blogObj = {
      title: title,
      author: author,
      url: url
    }
    const returnedBlog = await blogService.create(blogObj)
    const newUser = {
      name: user.name,
      username: user.name,
      id: user.id
    }
    returnedBlog.user = newUser
    setBlogs(blogs.concat(returnedBlog))
    notify(`A new blog '${blogObj.title}', by ${blogObj.author} added.`)
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const likeBlog = async id => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }
    try {
      const updatedBlog = await blogService.update(changedBlog)
      setBlogs(blogs.map(b => b.id !== id ? b : updatedBlog))
    } catch (e) {
      notify(`Blog '${blog.title}' on jo valitettavasti poistettu palvelimelta`, 'error')
      setBlogs(blogs.filter(b => b.id !== id))
    }
  }

  const deleteBlog = async id => {
    const blog = blogs.find(b => b.id === id)
    if (window.confirm(`Poistetaanko '${blog.title}'`))
      try {
        await blogService.deleteBlog(id)
        setBlogs(blogs.filter(b => b.id !== id))
        notify(`Blog '${blog.title}' poistettu palvelimelta`)
      } catch (e) {
        notify('Blogin poistaminen ei onnistunut', 'error')
      }
  }

  const rows = () => blogs.map(b =>
    <Blog
      key={b.id}
      blog={b}
      like={() => likeBlog(b.id)}
      deleteBlog={() => deleteBlog(b.id)}
    />
  )

  const loginForm = () => {
    return (
      <Togglable buttonLabel='login'>
        <LoginForm
          username={username}
          password={password}
          handleSubmit={handleLogin}
          handleUsernameChange={setUsername}
          handlePasswordChange={setPassword}
        />
      </Togglable>
    )
  }

  const newBlogForm = () => (
    <form onSubmit={newBlog}>
      <div>
        title:
        <input
          type="text"
          value={title}
          name="Title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <input
          type="text"
          value={author}
          name="Author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <input
          type="text"
          value={url}
          name="Url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )

  return (
    <div>
      <Notification notification={notification} />
      {user === null ?
        <div>
          {loginForm()}
        </div>
        :
        <div>
          <h2>Blogs</h2>
          <p>{user.name} logged in</p>
          <button onClick={handleLogout}>logout</button>
          {newBlogForm()}
          {rows()}
        </div>
      }
    </div>
  )
}

export default App