import React from 'react'
import { render, fireEvent } from 'react-testing-library'
import SimpleBlog from './SimpleBlog'

test('renders blog', () => {
  const blog = {
    title: 'Blog title',
    author: 'Blog author',
    likes: 73
  }

  const component = render(
    <SimpleBlog
      blog={blog}
    />
  )

  const blogTitle = component.getByText('Blog title Blog author')
  expect(blogTitle).toBeDefined()

  const blogLikes = component.getByText('blog has 73 likes')
  expect(blogLikes).toBeDefined()
})

test('clicking button calls event handler once', async () => {
  const blog = {
    title: 'Blog title',
    author: 'Blog author',
    likes: 73
  }
  const mockHandler = jest.fn()

  const { getByText } = render(
    <SimpleBlog
      blog={blog}
      onClick={mockHandler}
    />
  )

  const button = getByText('like')
  fireEvent.click(button)

  expect(mockHandler.mock.calls.length).toBe(1)
})