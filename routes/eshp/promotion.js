'use strict';

import express from 'express';
import Hongbao from '../../controller/eshp/promotion/hongbao';

const router = express.Router();

router.get('/users/:user_id/hongbaos', Hongbao.getHongbao);
router.get('/users/:user_id/expired_hongbaos', Hongbao.getExpiredHongbao);

export default router;
