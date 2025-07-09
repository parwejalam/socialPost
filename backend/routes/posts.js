const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/posts');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const multer = require('multer');
const { count } = require('rxjs');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {       //cb is a callback function that tells multer where to store the file
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invilid mime type.")
        if (isValid) {
            error = null;
        }
        cb(error, 'backend/images'); // Store images in the 'backend/images' directory
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype]
        cb(null, name + '-' + Date.now() + '.' + ext)
    }
})

//post request to add a new post
router.post('', checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get("host")
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename
    });
    post.save().then(createdPost => {
        console.log(createdPost)
        res.status(201).json({
            message: 'Post added successfully!',
            post: {
                ...createdPost,
                id: createdPost._id,
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
// router.post('/bulk', (req, res) => {
//     const posts = Array.isArray(req.body) ? req.body : [req.body];
//     if (!Array.isArray(posts) || posts.length === 0) {
//         return res.status(400).json({ message: 'No posts provided' });
//     }

//     // Validate and map each post to match schema fields
//     const validPosts = posts
//         .filter(post => post.title && post.content) // basic validation
//         .map(post => ({
//             title: post.title,
//             content: post.content,
//             imagePath: post.imagePath
//         }));

//     if (validPosts.length === 0) {
//         return res.status(400).json({ message: 'No valid posts provided' });
//     }

//     Post.insertMany(validPosts)
//         .then(createdPosts => {
//             res.status(201).json({
//                 message: 'Posts added successfully!',
//                 posts: createdPosts.map(post => ({
//                     id: post._id,
//                     title: post.title,
//                     content: post.content,
//                     imagePath: post.imagePath
//                 }))
//             });
//         })
//         .catch(error => {
//             console.error('Error saving posts:', error);
//             res.status(500).json({
//                 message: 'Creating posts failed!',
//                 error: error.message
//             });
//         });
// });

//update post data.
router.put("/:id", checkAuth, multer({ storage: storage }).single("image"), (req, res, next) => {
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
    console.log(post);
    Post.updateOne({ _id: req.params.id }, post).then(result => {
        res.status(200).json({
            message: "Post updated successFul!",
            // post: post
        })
    })
});

// get request to fetch all posts
router.get('', (req, res, next) => {
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
                        imagePath: doc.imagePath
                    };
                }),
                maxPosts: count
            });
        }).catch(error => {
            res.status(500).json({
                message: 'Fetching posts failed!',
                error: error.message || error
            });
        });
})

router.get("/:id", (req, res, next) => {
    Post.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: "Post not found!" });
        }
    });
});

// delete request to remove a post by its ID
router.delete("/:id", checkAuth, (req, res, next) => {
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