// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const totalLikes = blogs.reduce((allLikes, blog) => {
    allLikes = allLikes + blog.likes
    return allLikes
  }, 0)
  return totalLikes
}

const favoriteBlog = (blogs) => {
  const favoriteBlog = blogs.reduce((mostLikedBlog, blog) => {
    if (blog.likes > mostLikedBlog.likes) {
      mostLikedBlog = blog
    }
    return mostLikedBlog
  })
  return favoriteBlog
}

const mostBlogs = (blogs) => {

  const mostBlogs = { author: '', blogs: 0 }

  const totalBlogs = blogs.reduce((acc, cur) => {
    acc[cur.author] = (acc[cur.author] || 0) + 1
    return acc
  }, {})

  for (const author in totalBlogs) {
    if (totalBlogs[author] > mostBlogs.blogs) {
      mostBlogs.author = author
      mostBlogs.blogs = totalBlogs[author]
    }
  }

  return mostBlogs
}

const mostLikes = (blogs) => {
  const mostLikes = { author: '', likes: 0 }
  const totalLikes = blogs.reduce((acc, cur) => {
    acc[cur.author] = (acc[cur.author] || 0) + cur.likes
    return acc
  }, {})

  for (const author in totalLikes) {
    if (totalLikes[author] > mostLikes.likes) {
      mostLikes.author = author
      mostLikes.likes = totalLikes[author]
    }
  }
  return mostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}