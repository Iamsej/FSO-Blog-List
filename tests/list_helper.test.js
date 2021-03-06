const listHelper = require('../utils/list_helper')

const empty = []
const single = [{
  _id: '5a422a851b54a676234d17f7',
  title: 'React patterns',
  author: 'Michael Chan',
  url: 'https://reactpatterns.com/',
  likes: 7,
  __v: 0
}]
const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }  
]

test('dummy returns one', () => {
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

test('Testing tests', () => {
  const result = listHelper.mostLikes(blogs)
  expect(result).toEqual({'author': 'Edsger W. Dijkstra', 'likes': 17})
})

describe('total likes', () => {

    test('When list has only one blog, equals the likes of that', () => {
        const result = listHelper.totalLikes(single)
        expect(result).toBe(7)
    })

    test('When list has many blogs, equal the sum of their likes', () => {
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(36)
    })

    test('When list has no blogs, return 0', () => {
        const result = listHelper.totalLikes(empty)
        expect(result).toBe(0)
    })
})

describe('favorite blog', () => {
  
  test('When list has only one blog, return that blog', () => {
    const result = listHelper.favoriteBlog(single)
    expect(result).toEqual({
      title: 'React patterns',
      author: 'Michael Chan',
      likes: 7
    })
  })

  test('When list has multiple blogs, return blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    })
  })

  test('When list is empty, return error message', () => {
    const result = listHelper.favoriteBlog(empty)
    expect(result).toEqual({
      error: 'List is empty'
    })
  })

})

describe('most blogs', () => {
  test('When list has only one blog, return author of that blog', () => {
    const result = listHelper.mostBlogs(single)
    expect(result).toEqual({
      author: 'Michael Chan',
      blogs: 1
    })
  })

  test('When list has multiple blogs, return author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })

  test('When list is empty, return error message', () => {
    const result = listHelper.mostBlogs(empty)
    expect(result).toEqual({
      error: 'List is empty'
    })
  })
})

describe('most likes', () => {
  test('When list has only one blog, return author of that blog', () => {
    const result = listHelper.mostLikes(single)
    expect(result).toEqual({
      author: 'Michael Chan',
      likes: 7
    })
  })

  test('When list has multiple blogs, return author with most likes', () => {
    const result = listHelper.mostLikes(blogs)
    expect(result).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })

  test('When list is empty, return error message', () => {
    const result = listHelper.mostLikes(empty)
    expect(result).toEqual({
      error: 'List is empty'
    })
  })
})