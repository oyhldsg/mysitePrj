'use strict';

import ShopModel from '../../../models/eshp/shopping/shop';
import AddressComponent from '../../../prototype/eshp/addressComponent';
import Food from './food';
import formidable from 'formidable';
import CategoryHandle from './category';
import Rating from '../ugc/rating';

class Shop extends AddressComponent {
    constructor() {
        super();
        this.addShop = this.addShop.bind(this);
        this.getRestaurants = this.getRestaurants.bind(this);
        this.searchRestaurant = this.searchRestaurant.bind(this);
    }

    async addShop(req, res, next) {
        let restaurant_id;
        try {
            restaurant_id = await this.getId('restaurant_id');
        } catch(err) {
            console.log('get shop id failed');
            res.send({
                type: 'ERROR_DATA',
                message: '获取数据失败'
            });
            return;
        }
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            try {
                if (!fields.name) {
                    throw new Error('must fill shop name');
                } else if (!fields.address) {
                    throw new Error('must fill shop address');
                } else if (!fields.phone) {
                    throw new Error('must fill phone');

                } else if (!fields.latitude || !fields.longitude) {
                    throw new Error('shop position is error');
                } else if (!fields.image_path) {
                    throw new Error('musth upload image');
                } else if (!fields.category) {
                    throw new Error('must upload food kind');
                }
            } catch(err) {
                console.log('param error', err.message);
                res.send({
                    status: 0,
                    type: 'ERROR_PARAMS',
                    message: err.message
                });
                return;
            }
            const exists = await ShopModel.findOne({name: fields.name});
            if (exists) {
                res.send({
                    status: 0,
                    type: 'RESTAURANT_EXISTS',
                    message: '店铺已存在，请尝试其他店铺名称'
                })
                return;
            }
            const opening_hours = (fields.startTime && fields.endTime) ? (fields.startTime + '/' + fields.endTime) : "8:00/20:00";
            const newShop = {
                name: fields.name,
                address: fields.address,
                description: fields.description || '',
                float_delivery_fee: fields.float_delivery_fee || 0,
                float_minimum_order_amount: fields.float_minimum_order_amount || 0,
                id: restaurant_id,
                is_premium: fields.is_premium || false,
                is_new: fields.new | false,
                latitude: fields.latitude,
                longitude: fields.longitude,
                location: [fields.longitude, fields.latitude],
                opening_hours: [opening_hours],
                phone: fields.phone,
                promotion_info: fields.promotion_info || "欢迎光临，用餐高峰请提前下单，谢谢",
                rating: (4 + Math.random()).toFixed(1),
                rating_count: Math.ceil(Math.random()*1000),
                recent_order_num: Math.ceil(Math.random()*1000),
                status: Math.round(Math.random()),
                image_path: fields.image_path,
                category: fields.category,
                piecewise_agent_fee: {
                    tips: "配送费约￥" + (fields.float_delivery_fee || 0),
                },
                activities: [],
                supports: [],
                license: {
                    business_license_image: fields.business_license_image || '',
                    catering_service_license_image: fields.catering_service_license_image || '',
                },
                identification: {
                    company_name: "",
                    identificate_agency: "",
                    identificate_date: "",
                    legal_person: "",
                    licenses_date: "",
                    licenses_number: "",
                    licenses_scope: "",
                    operation_period: "",
                    registered_address: "",
                    registered_number: "",
                },
            };

            if (fields.delivery_mode) {
                Object.assign(newShop, {delivery_mode: {
                    color: "57A9FF",
                    id: 1,
                    is_solid: true,
                    text: "蜂鸟专送"
                }});
            }
            fields.activities.forEach((item, index) => {
                switch(item.icon_name) {
                    case '减':
                        item.icon_color = 'F07373';
                        item.id = index + 1;
                        break;
                    case '特':
                        item.icon_color = 'EDC123';
                        item.id = index + 1;
                        break;
                    case '新':
                        item.icon_color = '70BC46';
                        item.id = index + 1;
                        break;
                    case '领':
                        item.icon_color = 'E3EE0D';
                        item.id = index + 1;
                        break;
                }
                newShop.activities.push(item);
            })
            if (fields.bao) {
                newShop.supports.push({
                    description: "已加入“外卖保”计划，食品安全有保障",
                    icon_color: "999999",
                    icon_name: "保",
                    id: 7,
                    name: "外卖保"
                })
            }

            if (fields.zhun) {
                newShop.supports.push({
                    description: "准时必达，超时秒赔",
                    icon_color: "57A9FF",
                    icon_name: "准",
                    id: 9,
                    name: "准时达"
                })
            }

            if (fields.piao) {
                newShop.supports.push({
                    description: "该商家支持开发票，请在下单时填写好发票抬头",
                    icon_color: "999999",
                    icon_name: "票",
                    id: 4,
                    name: "开发票"
                });
            }

            try {
                const shop = new ShopModel(newShop);
                await shop.save();
                CategoryHandle.addCategory(fields.category);
                Rating.initData(restaurant_id);
                Food.initData(restaurant_id);
                res.send({
                    status: 1,
                    success: '添加餐馆成功',
                    shopDetail: newShop
                })
            } catch(err) {
                console.log('shop write database failed');
                res.send({
                    status: 0,
                    type: 'ERROR_SERVER',
                    message: '添加商铺失败',
                })
            }
        })
    }

    async getRestaurants(req, res, next) {
        const {
            latitude, 
            longitude,
            offset = 0,
            limit = 20,
            keyword,
            restaurant_category_id,
            order_by,
            extras,
            delivery_mode = [],
            support_ids = [],
            restaurant_category_ids = [],
        } = req.query;

        try {
            if (!latitude) {
                throw new Error('latitude param error');
            } else if (!longitude) {
                throw new Error('longitude param error');
            }
        } catch(err) {
            console.log('latitude, longitude param error');
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            });
            return;
        }
        let filter = {};
        if (restaurant_category_ids.length && Number(restaurant_category_ids[0])) {
            const category = await CategoryHandle.findById(restaurant_category_ids[0]);
            Object.assign(filter, {category});
        }

        let sortBy = {};
        if (Number(order_by)) {
            switch(Number(order_by)) {
                case 1:
                    Object.assign(sortBy, {float_minimum_order_amount: 1});
                    break;
                case 2: 
                    Object.assign(filter, {location: {$near: [longitude, latitude]}});
                    break;
                case 3:
                    Object.assign(sortBy, {rating: -1});
                    break;
                case 5:
                    Object.assign(filter, {location: {$near: [longitude, latitude]}});
                    break;
                case 6:
                    Object.assign(sortBy, {recent_order_num: -1});
                    break;
            }
        }

        if (delivery_mode.length) {
            delivery_mode.forEach(item => {
                if (Number(item)) {
                    Object.assign(filter, {'delivery_mode.id': Number(item)});
                }
            })
        }

        if (support_ids.length) {
            const filterArr = [];
            support_ids.forEach(item => {
                if (Number(item) && (Number(item) !== 8)) {
                    filterArr.push(Number(item));
                } else if (Number(item) == 8) {
                    Object.assign(filter, {is_premium: true});
                }
            });
            if (filterArr.length) {
                Object.assign(filter, {'supports.id': {$all: filterArr}});
            }
        }
        const restaurants = await ShopModel.find(filter, '-_id').sort(sortBy).limit(Number(limit)).skip(Number(offset));
        const from = latitude + ',' + longitude;
        let to = '';
        restaurants.forEach((item, index) => {
            const slpitStr = (index == restaurants.length - 1) ? '' : '|';
            to += item.latitude + ',' + item.longitude + slpitStr;
        });
        try {
            if (restaurants.length) {
                const distance_duration = await this.getDistance(from, to);
                restaurants.map((item, index) => {
                    return Object.assign(item, distance_duration[index]);
                })
            }
        } catch(err) {
            console.log('from addresscomponent get distance data failed', err);
            restaurants.map((item, index) => {
                return Object.assign(item, {distance: '10公里', order_lead_time: '40分钟'});
            });
        }

        try {
            res.send(restaurants);
        } catch(err) {
            res.send({
                status: 0,
                type: 'ERROR_GET_SHOP_LIST',
                message: '获取店铺列表数据失败'
            })
        }
    }

    async searchRestaurant(req, res, next) {
        const {geohash, keyword} = req.query;
        try {
            if (!geohash || geohash.indexOf(',') == -1) {
                throw new Error('latitude and longitude param error');
            } else if (!keyword) {
                throw new Error('keyword param error');
            }
        } catch(err) {
            console.log('search shop param error');
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            });
            return;
        }
        try {
            const restaurants = await ShopModel.find({name: eval('/' + keyword + '/gi')}, '-_id').limit(50);
            if (restaurants.length) {
                const [latitude, longitude] = geohash.split(',');
                const from = latitude + ',' + longitude;
                let to = '';

                restaurants.forEach((item, index) => {
                    const slpitStr = (index == restaurants.length - 1) ? '' : '|';
                    to += item.latitude + ',' + item.longitude + slpitStr;
                });
                const distance_duration = await this.getDistance(from, to);
                restaurants.map((item, index) => {
                    return Object.assign(item, distance_duration[index]);
                });
            }
            res.send(restaurants);
        } catch(err) {
            console.log('search restaurant data failed');
            res.send({
                status: 0,
                type: 'ERROR_DATA',
                message: '搜索餐馆数据失败'
            })
        }
    }

    async getRestaurantDetail(req, res, next) {
        const restaurant_id = req.params.restaurant_id;
        if (!restaurant_id || !Number(restaurant_id)) {
            console.log('get restaurant detail info error');
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: '餐馆ID参数错误',
            });
            return;
        }
        try {
            const restaurant = await ShopModel.findOne({id: restaurant_id}, '-_id');
            res.send(restaurant);
        } catch(err) {
            console.log('get restaurant detail failed', err);
            res.send({
                status: 0,
                type: 'GET_DATA_ERROR',
                message: '获取餐馆详情失败'
            })
        }
    }
    async getShopCount(req, res, next) {
        try {
            const count = await ShopModel.count();
            res.send({
                status: 1,
                count,
            });
        } catch(err) {
            console.log('get restaurant count failed', err);
            res.send({
                status: 0,
                type: 'ERROR_TO_GET_COUNT',
                message: '获取餐馆数量失败'
            })
        }
    }
    async updateshop(req, res, next) {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log('get shop info form error', err);
                res.send({
                    status: 0,
                    type: 'ERROR_FORM',
                    message: '表单信息错误'
                });
                return;
            }
            const {name, address, description = "", phone, category, id, latitude, longitude, image_path} = fields;
            if (id == 1) {
                res.send({
                    status: 0,
                    message: '此店铺用做展示，请不要修改'
                });
                return;
            }
            try {
                if (!name) {
                    throw new Error('restaurant name error');
                } else if (!address) {
                    throw new Error('restaurant address error');
                } else if (!phone) {
                    throw new Error('restaurant phone error');
                } else if (!category) {
                    throw new Error('restaurant kind error');
                } else if (!id || !Number(id)) {
                    throw new Error('restaurant id error');
                } else if (!image_path) {
                    throw new Error('restaurant image address error');
                }

                let newData;
                if (latitude && longitude) {
                    newData = {name, address, description, phone, category, latitude, longitude, image_path};
                } else {
                    newData = {name, address, description, phone, category, image_path};
                }
                await ShopModel.findOneAndUpdate({id}, {$set: newData});
                res.send({
                    status: 1,
                    success: '修改商铺信息成功',
                });
            } catch(err) {
                console.log(err.message, err);
                res.send({
                    status: 0, 
                    type: 'ERROR_UPDATE_RESTAURANT',
                    message: '更新商铺信息失败'
                });
            }
        })
    }

    async deleteRestaurant(req, res, next) {
        const restaurant_id = req.params.restaurant_id;
        if (!restaurant_id || !Number(restaurant_id)) {
            console.log('restaurant_id param error');
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: 'restaurant_id param error',
            });
            return;
        }
        if (restaurant_id == 1) {
            res.send({
                status: 0,
                message: '此店铺用做展示，请不要删除'
            });
            return;
        }
        try {
            await ShopModel.remove({id: restaurant_id});
            res.send({
                status: 1,
                success: '删除餐馆成功'
            });
        } catch(err) {
            console.log('delete restaurant failed', err);
            res.send({
                status: 0,
                type: 'DELETE_RESTAURANT_FAILED',
                message: '删除餐馆失败'
            });
        }
    }
}

export default new Shop();
