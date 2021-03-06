'use strict';

import express from 'express';
import Admin from '../../controller/eshp/admin/admin';

const router = express.Router();

router.post('/login', Admin.login);
router.get('/signout', Admin.signout);
router.get('/all', Admin.getAllAdmin);
router.get('/count', Admin.getAdminCount);
router.get('/info', Admin.getAdminInfo);
router.post('/update/avatar/:admin_id', Admin.updateAvatar);

export default router;
