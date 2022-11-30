const {sign} = require('jsonwebtoken');

const generateAccessToken = (userId) => {
    return sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '5m'
    })
};

const generateRefreshToken = (userId) => {
    return sign({userId}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '1d'
    })
};

module.exports = {generateAccessToken, generateRefreshToken};