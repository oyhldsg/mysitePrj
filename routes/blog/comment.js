'use strict';

import express from 'express';
import Comment from '../../controller/blog/comment';

const router = express.Router();

router.post('/', Comment.addComment);
router.get('/all', Comment.getArticleComment);
router.patch('/:id', Comment.updateArticleLikeById);

export default router;
