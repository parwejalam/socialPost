const mongoose = require('mongoose');
const Post = require('../models/posts');


exports.addPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host")
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    });
    post.save().then(createdPost => {
        res.status(200).json({
            message: 'Post added successfully!',
            post: {
                ...createdPost,
                id: createdPost._id,
            },
        })
    }).catch(err => {
        console.error('Error saving post:', err);
        res.status(500).json({
            message: 'Creating post failed!',
            error: err.message // Send only the error message for security
        });
    });
}

exports.addBulkPosts = (req, res) => {
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
            imagePath: post.imagePath
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
}

exports.updatePost = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + "://" + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }

    const post = new Post({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: req.body.imagePath
    });
    console.log("Updated Post",post);
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
        if (result.modifiedCount > 0) {
            res.status(200).json({
                message: "Post updated successFul!",
                // post: post
            })
        } else {
            res.status(401).json({ message: "Not Authorized" })
        }
    })
}

exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: "Post not found!" });
        }
    });
}

exports.getPosts = (req, res, next) => {
    let pageSize = parseInt(req.query.pagesize);
    let currentPage = parseInt(req.query.page);
    const postQuery = Post.find();
    let fetchedPost;

    if (!isNaN(pageSize) && !isNaN(currentPage)) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }

    postQuery
        .then(document => {
            fetchedPost = document;
            // Use countDocuments instead of deprecated count
            return Post.countDocuments();
        })
        .then(count => {
            res.status(200).json({
                message: 'Posts fetched successfully!',
                posts: fetchedPost.map(doc => {
                    return {
                        id: doc._id,
                        title: doc.title,
                        content: doc.content,
                        imagePath: doc.imagePath,
                        creator: doc.creator
                    };
                }),
                maxPosts: count
            });
        }).catch(err => {
            res.status(500).json({
                message: 'Fetching posts failed!',
                error: err.message || err
            });
        });
}

exports.deletePost = (req, res, next) => {
    // Basic validation of the ID
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid post ID' });
    }
    //delete the post by ID
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        console.log("Post deleted successfully");
        if (result.deletedCount > 0) {
            res.status(200).json({
                message: 'Post deleted successfully!'
            });
        } else {
            res.status(401).json({ message: "Not Authorized!" })
        }
    }).catch(err => {
        console.error('Error deleting post:', err);
        res.status(500).json({
            message: 'Deleting post failed!',
            error: err.message // Send only the error message for security
        });
    });
}