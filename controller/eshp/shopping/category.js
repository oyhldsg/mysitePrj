'use strict';

import CategoryModel from '../../../models/eshp/shopping/category';
import BaseComponent from '../../../prototype/eshp/baseComponent';
import DeliveryModel from '../../../models/eshp/shopping/delivery';
import ActiveityModel from '../../../models/eshp/shopping/activity';

class Category extends BaseComponent {
    constructor() {
        super();
    }

    async getCategories(req, res, next) {
        try {
            const categories = await CategoryModel.find({}, '-_id');
            res.send(categories);
        } catch(err) {
            console.log('get categories failed');
            res.send({
                status: 0,
                type: 'ERROR_DATA',
                message: '获取categories失败'
            })
        }
    }

    async addCategory(type) {
        try {
            await CategoryModel.addCategory(type);
        } catch(err) {
            console.log('add category count failed');
        }
    }

    async findById(id) {
        try {
            const CateEntity = await CategoryModel.findOne({'sub_categories.id': id});
            let categoName = CateEntity.name;
            CateEntity.sub_categories.forEach(item => {
                if (item.id == id) {
                    categoName += '/' + item.name;
                }
            });
            return categoName;
        } catch(err) {
            console.log('get data failed by category id');
            throw new Error(err);
        }
    }

    async getDelivery(req, res, next) {
        try {
            const deliveries = await DeliveryModel.find({}, '-_id');
            res.send(deliveries);
        } catch(err) {
            console.log('get delivery data failed');
            res.send({
                status: 0,
                type: 'ERROR_DATA',
                message: '获取配送方式数据失败'
            })
        }
    }

    async getActivity(req, res, next) {
        try {
            const activities = await ActivityModel.find({}, '-_id');
            res.send(activities);
        } catch(err) {
            console.log('get activity data failed');
            res.send({
                status: 0,
                type: 'ERROR_DATA',
                message: '获取活动数据失败'
            })
        }
    }
}

export default new Category();
