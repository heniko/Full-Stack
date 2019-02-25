import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import { useField } from './hooks'
import BlogForm from './components/BlogForm';


const App = () => {
  const [blogs, setBlogsAsSorted] = useState([])
  const [user, setUser] = useState(null)
  const username = useField('text')
  const password = useField('password')
  const title = useField('text')
  const author = useField('text')
  const url = useField('text')
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
    setBlogsAsSorted(sorted)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username: username.value,
        password: password.value
      })

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      username.reset()
      password.reset()
    } catch (e) {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      window.localStorage.removeItem('loggedBlogAppUser')
      setUser(null)
      notify('logged out successfully')
    } catch (e) {}
  }

  const newBlog = async (event) => {
    event.preventDefault()
    const blogObj = {
      title: title.value,
      author: author.value,
      url: url.value
    }
    const currentUser = {
      username: user.username,
      name: user.name
    }

    const returnedBlog = await blogService.create(blogObj)
    returnedBlog.user = currentUser
    setBlogs(blogs.concat(returnedBlog))
    notify(`A new blog '${blogObj.title}', by ${blogObj.author} added.`)
    title.reset()
    author.reset()
    author.reset()
  }

  const likeBlog = async id => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }
    try {
      const updatedBlog = await blogService.update(changedBlog)
      updatedBlog.user = blog.user
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
      deleteVisible={user.username === b.user.username}
    />
  )

  const loginForm = () => {
    return (
      <Togglable buttonLabel='login'>
        <LoginForm
          username={username}
          password={password}
          handleSubmit={handleLogin}
        />
      </Togglable>
    )
  }

  const newBlogForm = () => {
    return (
      <Togglable buttonLabel='Add blog'>
        <BlogForm
          handleSubmit={newBlog}
          author={author}
          title={title}
          url={url}
        />
      </Togglable>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification notification={notification} />
      {user === null ?
        <div>
          {loginForm()}
        </div>
        :
        <div>
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