const Post = require('../models/Post');
const mongoose = require('mongoose');

const getPosts = async(req, res) => {
    try {
        const posts = await Post.find();
        return res.status(200).json(posts)
    } 
    catch (error) {
        res.status(404).json(error)
    }
}

const getPost = async(req, res) => {
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({message: 'No Post Exists'});
    try {
        const post = await Post.findById(id);
        return res.status(200).json(post)
    } 
    catch (error) {
        res.status(404).json(error)
    }
}

const createPost = async(req, res) => {
    const {title, body} =  req.body;
    const {name, _id} = req.user;
    if (!name || !_id) return res.status(404).json({message: 'User Not Found'});
    if(!title || !body) return res.status(404).json({message: 'All fields Required'});
    try {
        const post = await Post.create({
            title: title,
            body: body,
            likes: [],
            author: name,
            userId: _id
        });
        return res.status(200).json(post)
    } 
    catch (error) {
        res.status(404).json(error)
    }
}

const deletePost = async(req, res) => {
    const {id} = req.params;
    const {_id} = req.user;
    if (!_id) return res.status(404).json({message: 'User Not Found'});
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({message: 'No Post Exists'});
    const post = await Post.findById(id);
    if (post.userId.valueOf() !== _id.valueOf()) return res.status(404).json({message: 'This is not your post'});
    try {
        const deletedPost = await Post.findByIdAndDelete(id);
        return res.status(200).json(deletedPost);
    } 
    catch (error) {
        res.status(404).json(error)
    }
}

const likePost = async(req, res) => {
    const {id} = req.params;
    const {_id} = req.user;
    if (!_id) return res.status(404).json({message: 'User Not Found'});
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({message: 'No Post Exists'});
    const post = await Post.findById(id);
    if (post.userId.valueOf() === _id.valueOf()) return res.status(404).json({message: 'You cannot like your own post'});
    if (post.likes.includes(_id)) return res.status(404).json({message: 'You already liked this post'});
    try {
        const updatedPost = await Post.findByIdAndUpdate(id, {
            $push: {likes: req.user._id},
        },
        {new: true});
        return res.status(200).json(updatedPost);
    } 
    catch (error) {
        res.status(404).json(error)
    }
}

module.exports = {getPosts, getPost, likePost, createPost, deletePost};