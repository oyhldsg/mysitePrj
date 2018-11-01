'use strict';

import express from 'express';
import CityHandle from '../../controller/eshp/v1/cities';
import SearchPlace from '../../controller/eshp/v1/search';
import Carts from '../../controller/eshp/v1/carts';
import Address from '../../controller/eshp/v1/address';
import Remark from '../../controller/eshp/v1/remark';
import BaseComponent from '../../prototype/eshp/baseComponent';
import Captchas from '../../controller/eshp/v1/captchas';
import User from '../../controller/eshp/v1/user';
import Order from '../../controller/eshp/v1/order';
import Hongbao from '../../controller/eshp/promotion/hongbao';
import Entry from '../../controller/eshp/v1/entry';
import Explain from '../../controller/eshp/v1/explain';
import Shop from '../../controller/eshp/shopping/shop';

const baseHandle = new BaseComponent();
const router = express.Router();

router.get('/cities', CityHandle.getCity);
router.get('/cities/:id', CityHandle.getCityById);
router.get('/exactaddress', CityHandle.getExactAddress);
router.get('/pois', SearchPlace.search);
router.post('/addimg/:type', baseHandle.uploadImg);
router.post('/carts/checkout', Carts.checkout);
router.get('/carts/:cart_id/remarks', Remark.getRemarks);
router.post('captchas', Captchas.getCaptchas);
router.get('/user', User.getInfo);
router.get('/user/:user_id', User.getInfoById);
router.get('/users/list', User.getUserList);
router.get('/users/count', User.getUserCount);
router.get('/user/:user_id/addresses', Address.getAddress);
router.post('/users/:user_id/addresses', Address.addAddress);
router.get('/user/city/count', User.getUserCity);
router.get('/address/:address_id', Address.getAddressById);
router.delete('/users/:user_id/addresses/:address_id', Address.deleteAddress);
router.post('/user/:user_id/carts/:cart_id/orders', Order.postOrder);
router.post('/users/:user_id/hongbao/exchange', Hongbao.exchange);
router.get('/index_entry', Entry.getEntry);
router.get('/pois/:geohash', CityHandle.pois);
router.post('/login', User.login);
router.get('/signout', User.signout);
router.post('/changepassword', User.changePassword);
router.get('/profile/explain', Explain.getExplain);
router.get('/restaurants', Shop.searchRestaurant);

export default router;
