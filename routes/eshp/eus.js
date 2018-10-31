'use strict';

import express from 'express';
import User from '../../controller/eshp/v1/user';

const router = express.Router();

router.post('/users/:user_id/avatar', User.updateAvatar);

export default router;
