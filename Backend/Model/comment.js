const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        postId: { type: mongoose.Schema.Types.ObjectId, ref: "posts" },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
        description: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("Comment", commentSchema);
