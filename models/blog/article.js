'use strict';

import mongoose from 'mongoose';
import Sequence from './sequence';

const ArticleSchema = new mongoose.Schema({
    aid: {type: Number, index: {unique: true}},
    title: String,
    content: String,
    tags: [String],
    date: Date,
    isPublish: Boolean,
    comment_n: Number
});

ArticleSchema.index({aid: 1});

ArticleSchema.pre('save', function(next) {
    var self = this;
    if (self.isNew) {
        Sequence.increment('Article', function(err, result) {
            if (err)
                throw err;
            self.aid = result.value.next;
            next();
        });
    } else {
        next();
    }
});

const Article = mongoose.model('Article', ArticleSchema);

export default Article;
