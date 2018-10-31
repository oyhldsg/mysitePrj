'use strict';

import express from 'express';
import Order from '../../controller/eshp/v1/order';

const router = express.Router();

router.get('/users/:user_id/orders', Order.getOrders);
router.get('/users/:user_id/orders/:order_id/snapshot', Order.getDetail);
router.get('/orders', Order.getAllOrders);
router.get('/orders/count', Order.getOrdersCount);

export default router;
