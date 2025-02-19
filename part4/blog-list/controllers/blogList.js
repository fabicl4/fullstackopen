const blogRouter = require('express').Router()
const Blog = require('../models/blogList')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  // 4.8 refactor the route handler to use the async/await syntax instead of promises.
  /*Blog.find({}).then(blogs => {
    response.json(blogs)
  })*/

  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 } )
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body
  /**
  * 4.17
  * Modify adding new blogs so that when a new blog is created, any user from
  * the database is designated as its creator
  */
  // To get any user you can use User.findOne({})
  const users = await User.find({})
  //const users = usersInDb.map(user => user.toJSON()) // parsed users

  if (users.length <= 0 )
  { // No user
    return response.status(400).json(
      {
        error: 'no users in the database'
      }
    )
  }

  // get first user for example
  const user = users[0]

  const blog = new Blog(
    {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user.id
    }
  )

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)

})

blogRouter.get('/:id', async (request, response) => {
  const note = await Blog.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// Delete blog
blogRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

// Update blog
blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogRouter