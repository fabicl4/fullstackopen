const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) return 0

  var result = blogs.reduce((accumulator, currentValue) => {
    return accumulator + currentValue.likes
  }, 0)

  return result
}

// 4.5
const favouriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {
      title: 'None',
      author: 'None',
      likes: 0
    }
  }

  // get blog with the most likes
  var result = blogs.reduce((max, blog) => {
    return blog.likes > max.likes ? blog : max
  }, blogs[0])

  return result
}

// 4.6
// return top blogger
const mostBlogs = blogs => {
  /**
   *  The idea is:
   *    1st. Get how many blogs each author post.
   *    2nd. Get the author with most post.
   */
  if (blogs.length === 0) {
    return null
  }

  const authorCounts = blogs.reduce(
    (acc, { author }) => ((acc[author] = (acc[author] || 0) + 1), acc),
    {}
  )

  const topAuthor = Object.entries(authorCounts).reduce((max, curr) =>
    curr[1] > max[1] ? curr : max
  )

  return { author: topAuthor[0], blogs:topAuthor[1] }
}

// 4.7
// The function returns the author, whose blog posts have the largest amount of likes
const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorCounts = blogs.reduce(
    (acc, { author, likes }) => ((acc[author] = (acc[author] || 0) + likes), acc),
    {}
  )

  const topAuthor = Object.entries(authorCounts).reduce((max, curr) =>
    curr[1] > max[1] ? curr : max
  )

  return { author: topAuthor[0], likes:topAuthor[1] }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}