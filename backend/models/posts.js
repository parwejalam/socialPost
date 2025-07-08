const mongoose = require('mongoose');

// Define the schema for a post
const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imagePath: { type: String, required: true }
});

module.exports = mongoose.model('Post', postSchema);