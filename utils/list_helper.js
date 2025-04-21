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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}