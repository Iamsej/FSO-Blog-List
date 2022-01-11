require('dotenv').config()

const PORT = process.env.PORT

const BLOG_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_BLOG_URI
  : process.env.BLOG_URI

module.exports = {
  BLOG_URI,
  PORT
}