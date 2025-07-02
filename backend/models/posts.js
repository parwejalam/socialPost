const mongooese = require('mongoose');

// Define the schema for a post
const postSchema = mongooese.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imagePath: { type: String, required: true }
});

module.exports = mongooese.model('Post', postSchema);