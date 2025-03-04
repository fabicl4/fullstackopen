const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  /*const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  response.json(users)*/
  const users = await User.find({}).populate('blogs')
  response.json(users)
})

/**
 * 4.15
 * Implement a way to create new users by doing an HTTP POST request to address
 * api/users. Users have a username, password and name.
 */
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  //console.log('post new user',request.body)

  if (!password) {
    return response.status(400).json(
      {
        error: 'the password is required!'
      }
    )
  }

  // 4.16 password must be at least 3 characters long.
  if (password.length < 3) {
    return response.status(400).json(
      {
        error: 'the password must be at least 3 character long'
      }
    )
  }

  /**
   * TODO: The operation must respond with a suitable status code and some kind
   * of an error message if an invalid user is created.
   */

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter