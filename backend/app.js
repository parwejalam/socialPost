const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
//     next();
// });

app.use(bodyParser.json());
app.use(cors());

const posts = [
    { id: '1', title: 'First Post', content: 'This is the first post!' },
    { id: '2', title: 'Second Post', content: 'This is the second post!' },
    { id: '3', title: 'Third Post', content: 'This is the third post!' }
];


app.post('/api/posts', (req, res, next) => {
    const post = req.body;
    posts.push(post);
    console.log(post);
    res.status(201).json({
        message: 'Post added successfully!',
    });
});

app.get('/api/get', (req, res, next) => {
    this.posts
    res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: posts
    });
});



module.exports = app;