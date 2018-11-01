'use strict';

import express from 'express';
import Shop from '../../controller/eshp/shopping/shop';
import Food from '../../controller/eshp/shopping/food';
import Category from '../../controller/eshp/shopping/category';
import Check from '../../middlewares/check';

const router = express.Router();

router.post('/addshop', Check.checkAdmin, Shop.addShop);
router.get('/restaurants', Shop.getRestaurants);
router.get('/restaurants/count', Shop.getShopCount);
router.post('/updateshop', Check.checkAdmin, Shop.updateshop);
router.delete('/restaurant/:restaurant_id', Check.checkSuperAdmin, Shop.deleteRestaurant);
router.get('/restaurant/:restaurant_id', Shop.getRestaurantDetail);
router.post('/addfood', Check.checkAdmin, Food.addFood);
router.get('/getcatagory/:restaurant_id', Food.getCategory);
router.post('/addcategory', Check.checkAdmin, Food.addCategory);
router.get('/menu', Food.getMenu);
router.get('/menu/:category_id', Food.getMenuDetail);
router.get('/foods', Food.getFoods);
router.get('/foods/count', Food.getFoodsCount);
router.post('/updatefood', Check.checkAdmin, Food.updateFood);
router.delete('/food/:food_id', Check.checkSuperAdmin, Food.deleteFood);
router.get('/restaurant/category', Category.getCategories);
router.get('/restaurants/delivery_modes', Category.getDelivery);
router.get('/restaurants/activity_attributes', Category.getActivity);

export default router;
