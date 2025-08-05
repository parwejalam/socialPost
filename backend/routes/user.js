const express = require('express');
const router = express.Router();

const UserControllers = require('../controllers/user')

// async function isEmailUnique(email) {
//     const existing = await User.findOne({ email });
//     return !existing;
// }

//For Sign up.
router.post('/signup', UserControllers.addUser);

// For login.
router.post("/login", UserControllers.loginUser)

module.exports = router;
