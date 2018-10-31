'use strict';

import express from 'express';
import VipCart from '../../controller/eshp/member/vipcart';

const router = express.Router();

router.post('/users/:user_id/delivery_card/physical_card/bind', VipCart.useCart);

export default router;
