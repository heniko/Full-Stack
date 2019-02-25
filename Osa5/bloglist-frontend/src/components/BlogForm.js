import React from 'react'

const BlogForm = ({
  handleSubmit,
  author,
  title,
  url
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        title:
        <input {...title.field} />
      </div>
      <div>
        author:
        <input {...author.field} />
      </div>
      <div>
        url:
        <input {...url.field} />
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm