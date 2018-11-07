'use strict';

import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    imgName: String,
    name: String,
    address: String,
    content: String,
    articleId: Number,
    date: Date,
    like: Number
});

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
