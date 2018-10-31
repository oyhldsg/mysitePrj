'use strict';

import express from 'express';
import Rating from '../../controller/eshp/ugc/rating';

const router = express.Router();

router.get('/restaurants/:restaurant_id/ratings', Rating.getRatings);
router.get('/restaurants/:restaurant_id/rating/scores', Rating.getScores);
router.get('/restaurants/:restaurant_id/rating/tags', Rating.getTags);

export default router;
