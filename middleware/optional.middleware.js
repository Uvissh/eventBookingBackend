const jwt = require("jsonwebtoken");

const optionalAuth = (req, res, next) => {

    const authHeader = req.headers.authorization;

    // No token
    if (!authHeader) {
        req.userId = null;
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.userId = decoded.userId;

        next();

    } catch (error) {

        // Invalid token
        req.userId = null;

        next();
    }
};

module.exports = optionalAuth;