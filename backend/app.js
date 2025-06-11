const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Post = require('./models/posts');
const mongoose = require('mongoose');


const app = express();
const mongoURL = 'mongodb+srv://parwejalamgtMDB:4A30qrepGeMOTNfl@cluster0.jv2zghn.mongodb.net/angular-node?retryWrites=true&w=majority&appName=Cluster0'

// Connect to MongoDB
mongoose.connect(mongoURL)
    .then(() => {
        console.log('Connected successfully to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

app.use(bodyParser.json());
app.use(cors());

//post request to add a new post
app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: req.body.imagePath
    });
    post.save()
    console.log(post)
    res.status(201).json({
        message: 'Post added successfully!',
        post: {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath
        }
    });
});

// get request to fetch all posts
app.get('/api/posts', (req, res, next) => {
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


app.delete("/api/posts/:id", (req, res) => {
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


module.exports = app;