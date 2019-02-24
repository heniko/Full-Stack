import React, { useState } from 'react'

const Blog = ({ blog, like, deleteBlog, deleteVisible }) => {
  const [visible, setVisible] = useState(false)
  const showDelete = { display: deleteVisible ? '' : 'none' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const toggleVisible = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div onClick={() => toggleVisible()}>
        {blog.title}, by {blog.author}
      </div>
      <div style={showWhenVisible}>
        <div>
          {blog.url}
        </div>
        <div>
          {blog.likes}
          <button onClick={like}>like</button>
        </div>
        <div>
          added by {blog.user.name}
        </div>
        <div style={showDelete}>
          <button onClick={deleteBlog}>delete</button>
        </div>
      </div>
    </div>
  )
}

export default Blog