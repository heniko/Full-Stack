const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const testHelper = require('./test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(testHelper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(testHelper.initialBlogs[1])
    await blogObject.save()
})

describe('GET /api/blogs', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('right number of blogs is returned', async () => {
        const res = await api.get('/api/blogs')
        expect(res.body.length).toBe(testHelper.initialBlogs.length)
    })
})

describe('POST /api/blogs', () => {
    test('a valid new blog can be added', async () => {
        const newBlog = new Blog({
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7
        })
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const notesAfterAdding = await testHelper.blogsInDB()
        expect(notesAfterAdding.length).toBe(testHelper.initialBlogs.length + 1)
    })
})

afterAll(() => {
    mongoose.connection.close()
})