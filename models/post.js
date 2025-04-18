const mongoose = require('mongoose');

let postSchema = mongoose.Schema({
    content: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.models.post || mongoose.model("post", postSchema);
