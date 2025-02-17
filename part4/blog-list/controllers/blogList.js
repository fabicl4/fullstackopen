const blogRouter = require('express').Router()
const Blog = require('../models/blogList')

blogRouter.get('/', async (request, response) => {
  // 4.8 refactor the route handler to use the async/await syntax instead of promises.
  /*Blog.find({}).then(blogs => {
    response.json(blogs)
  })*/

  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
  const body = request.body

  const blog = new Blog(
    {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
    }
  )

  //console.log(blog)

  /*blog
    .save()
    .then(result => {
      response.status(201).json(result)
    }).catch(error => next(error))
  */
  // TODO: Eliminate try-catch
  const savedBlog = await blog.save()
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