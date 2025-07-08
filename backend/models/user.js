const mongoose = require('mongoose');

// Define the schema for a user
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Middleware to handle duplicate key errors gracefully
userSchema.post(['save', 'insertMany', 'updateOne', 'findOneAndUpdate'], function (error, doc, next) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        const field = error?.keyValue ? Object.keys(error.keyValue)[0] : 'Field';
        next(new Error(`${field} must be unique.`));
    } else {
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);
