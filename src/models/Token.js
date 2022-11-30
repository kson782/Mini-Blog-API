const mongoose = require('mongoose');
const {hash} = require('bcrypt');

const RefreshTokenSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    token: {
        type: String,
        required: true,
    },
},
{
    timestamps: true
});

module.exports = mongoose.model("Token", RefreshTokenSchema);