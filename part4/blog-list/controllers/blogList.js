const blogsRouter = require('express').Router()
const Blog = require('../models/blogList')
const User = require('../models/user')

const jwt = require('jsonwebtoken')

const middleware = require('../utils/middleware')

/*
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}*/

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 } )
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  // [4.18] Making this change, makes all test invalid since you need to log in first with an user
  /*const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)*/
  //console.log('Post new blog')
  // 4.22 changes
  const user = request.user
  //const user = await User.findById(userId)
  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  //console.log(user)


  /**
  * 4.17
  * Modify adding new blogs so that when a new blog is created, any user from
  * the database is designated as its creator
  *
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
  const user = users[0]*/

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

blogsRouter.get('/:id', async (request, response) => {
  const note = await Blog.findById(request.params.id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// Delete blog
blogsRouter.delete('/:id', async (request, response) => {
  /**
   * 4.21
   * Change the delete blog operation so that a blog can be deleted only by the
   * user who added it. Therefore, deleting a blog is possible only if the
   * token sent with the request is the same as that of the blog's creator.
   *
   * If deleting a blog is attempted without a token or by an invalid user, the
   * operation should return a suitable status code.
  */

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  // TODO: check user password??

  const user = await User.findById(decodedToken.id)

  // Invalid user (user does not exist)
  if (!user) {
    return response.status(400).json({ error: 'user does not exist' })
  }

  const blog = await Blog.findById(request.params.id)

  if (blog === null){
    return response.status(400).json({ error: 'blog not found' })
  }


  // blogs user owner and current user are not the same!
  // Exercise 4.21
  if ( blog.user === undefined || blog.user.toString() !== user.id.toString() ) {
    return response.status(401).json({ error: 'invalid user' })
  }

  // Delete blog
  await Blog.findByIdAndDelete(request.params.id)

  // Delete from blogs list in User.
  const newBlogsList = user.blogs.filter(blogID => (blogID.toString() !== request.params.id))

  await User.updateMany(
    { _id: user._id }, { $push: { blogs: newBlogsList } }
  )

  //console.log("end")

  response.status(204).end()
})

// Update blog
blogsRouter.put('/:id', async (request, response) => {
  // NOTE: no exercise ask to update this function. So there is no need to add
  // token authentication, but it should be done!
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

module.exports = blogsRouter