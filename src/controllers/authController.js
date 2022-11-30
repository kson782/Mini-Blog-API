const Token = require('../models/Token');
const User = require('../models/User');
const {compare, hash, genSalt} = require('bcrypt');
const {verify} = require('jsonwebtoken');
const {generateAccessToken, generateRefreshToken} = require('../utils')

const register = async(req, res) => {
    const {name, email, password, passwordConfirmation} = req.body; 
    if (!name || !email || !password || !passwordConfirmation) return res.status(400).json({message: 'All fields Required'});
    if (password !== passwordConfirmation) return res.status(400).json({message: 'Passwords do not match'});
    const hasAccount = await User.findOne({email: email});
    if (hasAccount) return res.status(400).json({message: 'You already have an account'});
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);
    const newUser = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
    });
    const accesstoken = await generateAccessToken(newUser._id);
    const refreshtoken = await generateRefreshToken(newUser._id);
    const token = await Token.create({
        token: refreshtoken,
        userId: newUser._id
    });
    res.cookie('token', refreshtoken, {
        httpOnly: true,
        secure: true,
        maxAge: 86400000
    });
    res.json({accesstoken});
}

const login = async(req, res) => {
    const {email, password} = req.body;
    if (!email || !password) return res.status(400).json({message: 'All fields required'});
    const user = await User.findOne({email: email})
    if (!user) return res.status(400).json({message: 'Invalid Email'})
    const passwordMatch = await compare(password, user.password)
    if(!passwordMatch) return res.status(400).json({message: 'Invalid Password'})
    const accesstoken = await generateAccessToken(user._id);
    const refreshtoken = await generateRefreshToken(user._id);
    const token = await Token.create({
        token: refreshtoken,
        userId: user._id
    });
    res.cookie('token', refreshtoken, {
        httpOnly: true,
        secure: true,
        maxAge: 86400000
    });
    res.json({accesstoken});
}

const logout = async(req, res) => {
    const token = req.cookies.token
    await Token.findOneAndDelete({
        token: token
    });
    res.cookie('token', '');
    res.status(200).json({message: 'Sucessfully Logged Out'});
}

const refreshToken = async(req, res) => {
    const token = req.cookies.token 
    if (!token) return res.json({accesstoken: ''});
    const payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
    await Token.findOneAndDelete({
        userId: payload.userId
    });
    const accesstoken = await generateAccessToken(payload.userId);
    const newRefreshtoken = await generateRefreshToken(payload.userId);
    await Token.create({
        token: newRefreshtoken,
        userId: payload.userId
    });
    res.cookie('token', newRefreshtoken, {
        httpOnly: true,
        secure: true,
        maxAge: 86400000
    });
    res.json({accesstoken});
}

module.exports = {register, login, logout, refreshToken};
