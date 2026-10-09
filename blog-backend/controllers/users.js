
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const { name, username } = req.body

  const user = await User.create({
    name,
    username,
  })

  res.status(201).json(user)
})

usersRouter.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json(user)
})

usersRouter.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  })

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  user.name = req.body.name
  await user.save()

  res.json(user)
})

module.exports = usersRouter