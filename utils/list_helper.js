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

const mostBlogs = (blogs) => {
    const authList = blogs.map(blog => blog.author)
    const mostFrequent = (array) => {
        const hashmap = array.reduce( (key, val) => {
            key[val] = (key[val] || 0 ) + 1
            return key
        },{})
        return Object.keys(hashmap).reduce(
            (a, b) => hashmap[a] > hashmap[b] ? [a, hashmap[a]] : [b, hashmap[b]], [])
    }
    const mostAuth = mostFrequent(authList)
    
    if (authList.length === 0) {
        return {error: 'List is empty'}
    } else if (authList.length === 1) {
        return {author: authList[0], blogs: 1}
    } else {
        return({author: mostAuth[0], blogs: mostAuth[1]})
    }
}

const mostLikes = (blogs) => {
    const authList = blogs.map(blog => {return({author: blog.author, likes: blog.likes})})
    const likeSum = (array) => {
        let midHash = {}
        for (let variable in array) {
            midHash[array[variable].author] = (midHash[array[variable].author] || 0) + array[variable].likes
        }
        return midHash
    }
    const midList = likeSum(authList)
    const end = Object.keys(midList).reduce(
        (a, b) => midList[a] > midList[b] ? a : b, null)
    
    if (!end) {
        return {error: 'List is empty'}
    } else {
        return {author: end, likes: midList[end]}
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}