const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')

const api = supertest(app)

const helper = require('./test_helper')

const User = require('../models/user')
const Blog = require('../models/blogList')

/**
 * Lastest version 4.23
 */

describe('when there are some blogs saved initially', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)

    const user = await User.insertOne({ username: 'root', name: 'root ', passwordHash: passwordHash })

    const initialBlogs = helper.initialBlogs.map(blog =>
      ({ ...blog, user: user._id })
    )

    const blogs = await Blog.insertMany(initialBlogs)

    const blogsID = blogs.map( (b) => b._id )

    await User.updateMany(
      { _id: user._id }, { $push: { blogs: blogsID } }
    )
  })

  /**
   * 4.8
   * Use the SuperTest library for writing a test that makes an HTTP GET request
   * to the /api/blogs URL. Verify that the blog list application returns the
   * correct amount of blog posts in the JSON format.
   */

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type',/application\/json/)
  })

  test('there are six notes', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, 6)
  })

  /**
   * 4.9
   * Write a test that verifies that the unique identifier property of the blog
   * posts is named id, by default the database names the property _id.
   */
  test('verify that the unique identifier property of the blog post is named id', async () => {
    // Get a blog an verify if the unique identifier of the blog is equal to the property id
    const uid = '5a422a851b54a676234d17f7'
    const response = await api.get(`/api/blogs/${uid}`)

    assert.strictEqual(response.body.id, uid)
  })

  /**
   * 4.10
   * Create a new blog post. verify that the total number of blogs in the system
   * is increased by one. You can also verify that the content of the blog post
   * is saved correctly to the database.
   */
  test('add a valid blog', async () => {
    // Change 4.23 create a token first.
    const res = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = res.body.token

    // Create a new blog
    const newBlog = {
      title: 'Title',
      author: 'Author',
      url: 'https://url.com/',
      likes: 0,
    }
    // post the blog
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // get all blogs
    const response = await api.get('/api/blogs')
    // verify total number of blogs
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    // verify content of the blog
    // we use the method some to check if there is a blog that contains all Blog content!
    assert(response.body.some(blog =>
      blog.title === newBlog.title &&
      blog.author === newBlog.author &&
      blog.url === newBlog.url &&
      blog.likes === newBlog.likes
    ))
  })

  describe('missing blog properties', () => {
    /**
     * 4.11
     * Write a test that verifies that if the likes property is missing from the
     * request, it will default to the value 0
     */
    test('verify that if the likes propery is missing from the request', async () => {
      // Change 4.23 create a token first.
      const res = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = res.body.token

      // Create a new blog
      const newBlog = {
        title: 'Title',
        author: 'Author',
        url: 'https://url.com/',
      }

      // post the blog
      // should create the new blog and the likes property will be set to 0.
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')

      const blogs = response.body.map(r => {
        const blog = new Blog(r)
        return blog.toJSON()
      })

      //console.log(blogs)
      assert(blogs.some(blog =>
        blog.title === newBlog.title &&
        blog.author === newBlog.author &&
        blog.url === newBlog.url &&
        blog.likes === 0
      ))
    })

    /**
     * 4.12
     * Verify that if the title or url properties are missing from the request data,
     * the backend responds to the request with the status code 400 Bad Request.
     */
    test('blog without title is not added', async () => {
      // Change 4.23 create a token first.
      const res = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = res.body.token

      const newBlog = {
        author: 'Author',
        url: 'https://url.com/',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      // get all blogs
      const response = await api.get('/api/blogs')
      // verify total number of blogs
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('blog without url is not added', async () => {
      // Change 4.23 create a token first.
      const res = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = res.body.token

      const newBlog = {
        title: 'Title',
        author: 'Author',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      // get all blogs
      const response = await api.get('/api/blogs')
      // verify total number of blogs
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('blog without title and url is not added', async () => {
      // Change 4.23 create a token first.
      const res = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = res.body.token

      const newBlog = {
        author: 'Author',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      // get all blogs
      const response = await api.get('/api/blogs')
      // verify total number of blogs
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      // Change 4.23 create a token first.
      const res = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = res.body.token

      // id of the first blog in the initialBlog array
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      //console.log(blogToDelete)

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    test('succeeds with status code 204 if id is non existing id', async () => {
      // Change 4.23 create a token first.
      const res = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = res.body.token

      //const blogsAtStart = await helper.blogsInDb()

      // try to delete a non existing ID
      const uid = await helper.nonExistingId()

      await api
        .delete(`/api/blogs/${uid}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)

      // get all blogs
      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('update blog information', async () => {
    test('update number of likes', async () => {
      // Change 4.23 create a token first.
      const res = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = res.body.token

      const blogs = await helper.blogsInDb()

      const blogToUpdate = blogs[0]
      blogToUpdate.likes = 3

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(blogToUpdate)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)

      assert.strictEqual(blogToUpdate.likes, updatedBlog.likes)
    })

    test('trying to update a non existing blog', async () => {
      // Change 4.23 create a token first.
      const res = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = res.body.token

      const uid = await helper.nonExistingId()

      const blog = {
        title: 'Title',
        author: 'Author',
        url: 'https://url.com/',
        likes: 2
      }

      await api
        .put(`/api/blogs/${uid}`)
        .set('Authorization', `Bearer ${token}`)
        .send(blog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('Update all blog properties', async () => {
      // Change 4.23 create a token first.
      const res = await api
        .post('/api/login')
        .send({ username: 'root', password: 'sekret' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = res.body.token

      const blogs = await helper.blogsInDb()

      const blogToUpdate = blogs[0]
      blogToUpdate.title = 'Update title'
      blogToUpdate.author = 'Update author'
      blogToUpdate.url = 'Update url'
      blogToUpdate.likes = 3

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(blogToUpdate)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)

      assert.deepStrictEqual(blogToUpdate, updatedBlog)
    })
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  //4.15 Test user creation
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    // Check if the username is included!
    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  describe('invalid user creation', () => {
    // no username
    test('tries to create an invalid user giving an no username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
    // no password
    test('tries to create an invalid user giving an no password', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
    // invalid username
    test('tries to create an invalid user giving an no username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'ml',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
    // invalid password
    test('tries to create an invalid user giving an invalid password', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'sa',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
    // unique username
    test('create a new user with a non unique username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })
})

test('add blog token not provided', async () => {
  // Create a new blog
  const newBlog = {
    title: 'Title',
    author: 'Author',
    url: 'https://url.com/',
    likes: 0,
  }
  // post the blog
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})

after(async () => {
  await mongoose.connection.close()
})