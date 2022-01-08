// const _ = require('lodash')

const dummy = (blogs) => {
  return(1)
}

const totalLikes = (blogs) => {
    const likesCount = blogs.map(blog => blog.likes)
    const reducer = (sum, add) => {
        return sum + add
    }
    return likesCount.length > 0 
        ? likesCount.reduce(reducer)
        : 0
}

// const favoriteAuthor

const favoriteBlog = (blogs) => {
    const reducer = (first, second) => {
        return second.likes > first.likes
            ? second
            : first
    }
    
    if (blogs.length > 0) {
        const max = blogs.reduce(reducer)
        const favorite = {
            title: max.title,
            author: max.author,
            likes: max.likes
        }
        return favorite
    } else {
        return {error: 'List is empty'}
    }

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}