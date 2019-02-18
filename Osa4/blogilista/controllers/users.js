const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res, next) => {
    try {
        const body = req.body
        const saltRounds = 10
        const hash = await bcrypt.hash(body.password, saltRounds)
        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash: hash
        })
        const savedUser = await user.save()
        res.json(savedUser)
    } catch (e) {
        next(e)
    }
})

usersRouter.get('/', async (req, res) => {
    const users = await User
        .find({})

    res.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter