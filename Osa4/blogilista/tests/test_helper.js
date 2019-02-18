const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    },
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12
    }
]

const blogsInDB = async () => {
    const blogs = await Blog.find({})
    return blogs.map(b=>b.toJSON())
}

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(u=>u.toJSON())
}

module.exports = {
    initialBlogs,
    blogsInDB,
    usersInDB
}