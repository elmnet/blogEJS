const mongoose = require('mongoose')

const template1 = new mongoose.Schema({
    title: String,
    description: String,
    image: String
})

const BlogPosts = mongoose.model('BlogPosts', template1)

module.exports = BlogPosts