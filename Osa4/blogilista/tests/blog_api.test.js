const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const testHelper = require('./test_helper')

describe('when there is initially some blogs saved', () => {
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

        test('_id is renamed to id', async()=>{
            const res = await api.get('/api/blogs')
            expect(res.body[0].id).toBeDefined()
            expect(res.body[0]._id).not.toBeDefined()
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

            const blogsAfterAdding = await testHelper.blogsInDB()
            expect(blogsAfterAdding.length).toBe(testHelper.initialBlogs.length + 1)
        })
    })

    describe('DELETE /api/blogs', () => {
        test('existing blog can be deleted', async () => {
            const blogsBeforeDeleting = await testHelper.blogsInDB()
            await api
                .delete(`/api/blogs/${blogsBeforeDeleting[0].id}`)
                .expect(204)

            const blogsAfterDeletingOne = await testHelper.blogsInDB()
            expect(blogsAfterDeletingOne.length).toBe(testHelper.initialBlogs.length - 1)
        })
    })
})

afterAll(() => {
    mongoose.connection.close()
})