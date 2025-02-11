const blogRouter = require('express').Router()
const Blog = require('../models/blogList')

blogRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

blogRouter.post('/', (request, response, next) => {
  const blog = new Blog(request.body)

  console.log(blog)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    }).catch(error => next(error))
})

module.exports = blogRouter