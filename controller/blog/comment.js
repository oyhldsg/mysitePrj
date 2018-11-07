'use strict';

import CommentModel from '../../models/blog/comment';

class Comment {
    contructor() {
    }

    async addComment(req, res, next) {
        CommentModel.findOne({name: req.body.name, articleId: req.body.articleId}, (err, doc) => {
            if (doc && doc.address !== req.body.address) {
                res.status(403).end('用户名已经存在');
            } else if (!doc || doc.address === req.body.address) {
                const comment = {
                    imgName: req.body.imgName,
                    name: req.body.name,
                    address: req.body.address,
                    date: Date(),
                    content: req.body.content,
                    articleId: req.body.articleId,
                    like: 0
                };
                const commentItem = new CommentModel(comment);
                await commentItem.save();
            }
        })
    }

    async getArticleComment(req, res, next) {
        const articleId = req.query.payload.id;
        if (req.query.payload.sort === 'date') {
            CommentModel.find({articleId: articleId}, 'name date content like imgName').sort({date: -1}).exec()
                .then((comments) => {
                    res.send(comments);
                });
        } else if (req.query.payload.sort === 'like') {
            CommentModel.find({articleId: articleId}, 'name date content like imgName').sort({like: -1}).exec()
                .then((comments) => {
                    res.send(comments);
                })
        } else {
            CommentModel.find({articleId: articleId}, 'name date content like imgName').exec().then((comments) => {
                res.send(comments);
            });
        }
    }

    async updateArticleLikeById(req, res, next) {
        const id = req.params.id;
        if (req.body.option === 'add') {
            CommentModel.update({_id: id}, {$inc: {like: 1}}, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).send('succeed in updating like');
                }
            })
        } else if (req.body.option === 'drop') {
            CommentModel.update({_id: id}, {$inc: {like: -1}}, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).send('succeed in updating like');
                }
            });
        }
    }
}

export default new Comment();
