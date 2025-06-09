const { verifyToken } = require('../services/jwt.service');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token required"
            });
        }

        const decoded = verifyToken(token); // HERE is where you use verifyToken
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

const optionalAuth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
        // Try to authenticate but don't fail if invalid
        try {
            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            // Ignore auth errors for optional auth
        }
    }
    next();
};

module.exports = {
    authMiddleware,
    optionalAuth
};