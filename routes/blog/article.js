'use strict';

import express from 'express';
import Article from '../../controller/blog/article';
import Check from '../../middlewares/check';

const router = express.Router();

router.post('/', Check.checkAdmin, Article.publishArticle);
router.get('/:aid', Article.getArticleById);
router.delete('/:aid', Article.deleteArticleById);
router.patch('/:aid', Check.checkAdmin, Article.updateArticleById);
router.get('/all', Article.getAllArticle);
router.get('/party', Article.getPartyArticle);
router.get('/tags', Article.getAllTags);

export default router;
