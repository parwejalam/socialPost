const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Auth Failed: No token provided." });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Auth Failed: Malformed token." });
        }
        const decodedToken = jwt.verify(token, "secrate_should_be_this_longer");
        req.userData = {email: decodedToken.email, userId : decodedToken.userId}
        next();
    } catch (error) {
        res.status(401).json({
            message: "Auth Failed.",
            error: error.message
        });
    }
}