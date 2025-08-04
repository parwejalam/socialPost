const mongoose = require('mongoose');

// Define the schema for a user
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Middleware to handle duplicate key errors gracefully
userSchema.post(['save', 'insertMany', 'updateOne', 'findOneAndUpdate'], function (err, doc, next) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
        const field = err?.keyValue ? Object.keys(err.keyValue)[0] : 'Field';
        next(new Error(`${field} must be unique.`));
    } else {
        next(err);
    }
});

module.exports = mongoose.model('User', userSchema);
