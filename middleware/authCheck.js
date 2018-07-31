const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');

module.exports = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ acess: 'denied no token' });
    }
    const token = req.headers.authorization.split(' ')[1];
    return jwt.verify(token, keys.secretOrPrivateKey, (err, decoded) => {
        // the 401 code is for unauthorized status
        if (err) { return res.status(401).end(); }
        const userId = decoded.sub;
        console.log(userId);
        return User.findById(userId, (userErr, user) => {
            if (userErr || !user) {
                return res.status(401).end();
            }
            // pass user details onto next route
            req.user = user
            return next();
        });
    });
};