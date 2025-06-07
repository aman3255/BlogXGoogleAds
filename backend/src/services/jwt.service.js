const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    const secret = process.env.JWT_SECRET_KEY;
    const options = {
        expiresIn: process.env.JWT_EXPIRES_IN
    };
    
    return jwt.sign(payload, secret, options);
};

const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET_KEY;
    return jwt.verify(token, secret);
};

module.exports = {
    generateToken, // this will be call in auth.controller.js
    verifyToken // this will be call in auth.middleware.js
};