const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const extractFile = require('../middleware/file')
// const Post = require('../models/posts');
// const { count } = require('rxjs');

const PostControllers = require('../controllers/posts')



//post request to add a new post
router.post('', checkAuth, extractFile, PostControllers.addPost);

// post request to add multiple records at once.
router.post('/bulk', PostControllers.addBulkPosts);


//update post data.
router.put("/:id", checkAuth, extractFile, PostControllers.updatePost);

//get single post
router.get("/:id", PostControllers.getPost);

// get request to fetch all posts
router.get('', PostControllers.getPosts);

// delete request to remove a post by its ID
router.delete("/:id", checkAuth, PostControllers.deletePost);


module.exports = router;