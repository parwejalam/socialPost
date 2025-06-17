const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/posts');
const router = express.Router();

//post request to add a new post
router.post('', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: req.body.imagePath
    });
    post.save().then(createdPost => {
        console.log(createdPost)
        res.status(201).json({
            message: 'Post added successfully!',
            post: {
                id: createdPost._id,
                title: createdPost.title,
                content: createdPost.content,
                imagePath: createdPost.imagePath
            },
        })
    }).catch(error => {
        console.error('Error saving post:', error);
        res.status(500).json({
            message: 'Creating post failed!',
            error: error.message // Send only the error message for security
        });
    });
});

// post request to add multiple records at once.
router.post('/bulk', (req, res) => {
    const posts = Array.isArray(req.body) ? req.body : [req.body];
    if (!Array.isArray(posts) || posts.length === 0) {
        return res.status(400).json({ message: 'No posts provided' });
    }

    // Validate and map each post to match schema fields
    const validPosts = posts
        .filter(post => post.title && post.content) // basic validation
        .map(post => ({
            title: post.title,
            content: post.content,
            imagePath: post.imagePath || ''
        }));

    if (validPosts.length === 0) {
        return res.status(400).json({ message: 'No valid posts provided' });
    }

    Post.insertMany(validPosts)
        .then(createdPosts => {
            res.status(201).json({
                message: 'Posts added successfully!',
                posts: createdPosts.map(post => ({
                    id: post._id,
                    title: post.title,
                    content: post.content,
                    imagePath: post.imagePath
                }))
            });
        })
        .catch(error => {
            console.error('Error saving posts:', error);
            res.status(500).json({
                message: 'Creating posts failed!',
                error: error.message
            });
        });
});

//update post data.
router.put("/:id", (req, res, next) => {
    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: req.body.imagePath
    });
    Post.updateOne({ _id: req.params.id }, post).then(result => {
        console.log(result);
        res.status(200).json({
            message: "Post updated successFul!",
            post: post
        })
    })
});

// get request to fetch all posts
router.get('', (req, res, next) => {
    Post.find().then(documents => {
        res.status(200).json({
            message: 'Posts fetched successfully!',
            posts: documents.map(doc => {
                return {
                    id: doc._id,
                    title: doc.title,
                    content: doc.content,
                    imagePath: doc.imagePath
                };
            })
        });
    }).catch(error => {
        res.status(500).json({
            message: 'Fetching posts failed!',
            error: error
        });
    });
})

// delete request to remove a post by its ID
router.delete("/:id", (req, res, next) => {
    // Basic validation of the ID
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid post ID' });
    }
    //delete the post by ID
    Post.deleteOne({ _id: req.params.id }).then(result => {
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        console.log("Post deleted successfully");
        res.status(200).json({
            message: 'Post deleted successfully!'
        });
    }).catch(error => {
        console.error('Error deleting post:', error);
        res.status(500).json({
            message: 'Deleting post failed!',
            error: error.message // Send only the error message for security
        });
    });
});


module.exports = router;