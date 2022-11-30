const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    author: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    likes: {
        type: [String],
        default: [],
    },
},
{
    timestamps: true
});

module.exports = mongoose.model("Post", PostSchema);