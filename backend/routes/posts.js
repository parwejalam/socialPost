const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const multer = require('multer');
// const Post = require('../models/posts');
// const { count } = require('rxjs');

const PostControllers = require('../controllers/posts')

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
router.post('', checkAuth, multer({ storage: storage }).single("image"), PostControllers.addPost);

// post request to add multiple records at once.
router.post('/bulk', PostControllers.addBulkPosts);


//update post data.
router.put("/:id", checkAuth, multer({ storage: storage }).single("image"), PostControllers.updatePost);

//get single post
router.get("/:id", PostControllers.getPost);

// get request to fetch all posts
router.get('', PostControllers.getPosts);

// delete request to remove a post by its ID
router.delete("/:id", checkAuth, PostControllers.deletePost);


module.exports = router;