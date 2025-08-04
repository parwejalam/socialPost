const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const router = express.Router();
const User = require('../models/user');
const user = require('../models/user');

async function isEmailUnique(email) {
    const existing = await User.findOne({ email });
    return !existing;
}

//For Sign up.
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const unique = await isEmailUnique(email);
        if (!unique) {
            return res.status(500).json({ message: 'Email already exists' });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hash });

        const result = await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            result: {
                id: result._id,
                email: result.email,
            }
        });
    } catch (err) {
        res.status(500).json(
            {
                message: 'Invalid Authentication credentials!'
            }
        );
    }
});

// For login.
router.post("/login", (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {
            return res.status(401).json({
                message: 'User not exist.'
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Auth Faild.'
                })
            }
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id },
                'secrate_should_be_this_longer',
                { expiresIn: "1h" });
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            })
        })
        .catch(err => {
            return res.status(401).json({
                message: 'Invalid authentication credentials!',
                error: err
            })
        })
})

module.exports = router;
