const User = require('../models/User');
const mongoose = require('mongoose');
const {hash, genSalt} = require('bcrypt');

const getUser = async(req, res) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({message: 'No User Exists'});
    try {
        const user = await User.findById(id);
        return res.status(200).json(user)
    } 
    catch (error) {
        res.status(404).json(error)
    }
}

const deleteAccount = async(req, res) => {
    const {id} = req.params;
    const {_id} = req.user;
    if (!_id) return res.status(404).json({message: 'User Not Found'});
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({message: 'No User Exists'});
    if (id !== _id.valueOf()) return res.status(404).json({message: 'This is not your Account'});
    try {
        const user = await User.findByIdAndDelete(id);
        return res.status(200).json(user)
    } 
    catch (error) {
        res.status(404).json(error)
    }
}

const changePassword = async(req, res) => {
    const {id} = req.params;
    const {password, passwordConfirmation} = req.body;
    const {_id} = req.user;
    if (!_id) return res.status(404).json({message: 'User Not Found'});
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({message: 'No User Exists'});
    if (id !== _id.valueOf()) return res.status(404).json({message: 'This is not your Account'});
    if (password !== passwordConfirmation) return res.status(404).json({message: 'Passwords do not match'});
    const salt = await genSalt(10);
    newPassword = await hash(password, salt);

    try {
        const user = await User.findByIdAndUpdate(id, {
            password: newPassword
        },
        {new: true});
        return res.status(200).json(user)
    } 
    catch (error) {
        res.status(404).json(error)
    }
}

module.exports = {getUser, deleteAccount, changePassword};