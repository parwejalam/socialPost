const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRoutes = require('./routes/posts');


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
app.use('/api/posts', postsRoutes);

module.exports = app;