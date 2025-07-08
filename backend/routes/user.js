const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user');

async function isEmailUnique(email) {
    const existing = await User.findOne({ email });
    return !existing;
}

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const unique = await isEmailUnique(email);
        if (!unique) {
            return res.status(400).json({ error: 'Email already exists' });
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
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
