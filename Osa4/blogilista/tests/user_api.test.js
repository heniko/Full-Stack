const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const testHelper = require('./test_helper')

describe('When there is initially one user in database', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        let userObject = new User({
            username: 'testUsername',
            name: 'testName',
            password: 'testPassword'
        })
        await userObject.save()
    })

    describe('GET /api/users', () => {
        test('return user in database', async () => {
            await api
                .get('/api/users')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })
        test('contains only one user', async () => {
            const res = await api.get('/api/users')
            expect(res.body.length).toBe(1)
        })
    })

    describe('POST /api/users', () => {
        test('creating user succeeds with unique username', async () => {
            const usersInBeginning = await testHelper.usersInDB()

            const newUser = {
                username: 'newUser',
                name: 'newName',
                password: 'newPassword'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            const usersAfter = await testHelper.usersInDB()
            expect(usersAfter.length).toBe(usersInBeginning.length + 1)
            
            const usernames = usersAfter.map(u => u.username)
            expect(usernames).toContain(newUser.username)
        })
        test('if username is already in use creation fails with proper statuscode and message', async () => {
            const usersInBeginning = await testHelper.usersInDB()

            let newUser = new User({
                username: 'testUsername',
                name: 'testName',
                password: 'testPassword'
            })

            const res = await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
                .expect('Content-Type', /application\/json/)

            expect(res.body.error).toContain('`username` to be unique')

            const usersAfter = await testHelper.usersInDB()
            expect(usersAfter.length).toBe(usersInBeginning.length)
        })
    })
})

afterAll(() => {
    mongoose.connection.close()
})