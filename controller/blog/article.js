'use strict';

import ArticleModel from '../../models/blog/article';
import CommentModel from '../../models/blog/comment';

class Article {
    constructor() {
    }

    async publishArticle(req, res, next) {
        const articleInfo = {
            comment_n: 0,
            title: req.body.title,
            content: req.body.content,
            date: Date(),
            tags: req.body.tags,
            isPublish: true
        };
        const articleItem = new ArticleModel(articleInfo);
        await articleItem.save();
        res.send({
            status: 1,
            success: '发布成功',
        });
    }

    async getArticleById(req, res, next) {
        ArticleModel.findOne({aid: req.params.aid}, (err, doc) => {
            if (err) {
                console.log(err);
            } else {
                res.status(200).send(doc);
            }
        });
    }

    async deleteArticleById(req, res, next) {
        ArticleModel.remove({aid: req.params.aid}, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                CommentModel.remove({articleId: req.params.aid}, (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.status(200).send('succeed in deleting ---' + data);
                    }
                })
            }
        })
    }

    async updateArticleById(req, res, next) {
        const aid = req.params.aid;
        const article = {
            title: req.body.title,
            tags: req.body.tags,
            date: Date(),
            content: req.body.content,
            isPublish: true
        };
        ArticleModel.update({aid: aid}, article, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                res.status(200).send('succeed in updating ---' + data.title);
            }
        })
    }

    async getAllArticle(req, res, next) {
        const page = req.query.payload.page;
        const value = req.query.payload.value;
        const limit = req.query.payload.limit - 0 || 4;
        const skip = limit * (page - 1);
        if (value && value !== '全部') {
            ArticleModel.find({tags: value, isPublish: true}).sort({date: -1}).limit(limit).skip(skip).exec().then((articles) => {
                res.send(articles);
            });
        } else {
            ArticleModel.find({isPublish: true}).sort({date: -1}).limit(limit).skip(skip).exec().then((articles) => {
                res.send(articles);
            });
        }
    }

    async getPartyArticle(req, res, next) {
        const key = req.query.payload.key;
        const value = req.query.payload.value;
        const page = req.query.payload.page || 1;
        const skip = 4 * (page - 1);
        const re = new RegExp(value, 'i');
        if (key === 'tags') {
            const arr = value.split(' ');
            ArtcleModel.find({tags: {$all: arr}})
                .sort({date: -1}).limit(4).skip(skip).exec()
                .then((articles) => {
                    res.send(articles);
                });
        } else if (key === 'title') {
            ArticleModel.find({title: re, isPublish: true})
                .sort({date: -1}).limit(4).skip(skip).exec()
                .then((articles) => {
                    res.send(articles);
                });
        } else if (key === 'date') {
            const nextDay = value + 'T24:00:00';
            ArticleModel.find({date: {$gte: new Date(value), $lt: new Date(nextDay)}})
                .sort({date: -1}).limit(4).skip(skip).exec()
                .then((articles) => {
                    res.send(articles);
                });
        }
    }

    async getAllTags(req, res, next) {
        ArticleModel.find({isPublish: true}).distinct('tags', (err, doc) => {
            if (err) {
                console.log(err);
            } else if (doc) {
                res.send(doc);
            }
        });
    }
}

export default new Article();
