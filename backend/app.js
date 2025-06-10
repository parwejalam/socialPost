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
    post.save();
    console.log(post);
    res.status(201).json({
        message: 'Post added successfully!',
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


module.exports = app;