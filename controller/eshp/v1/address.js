'use strict';

import BaseComponent from '../../../prototype/eshp/baseComponent';
import AddressModel from '../../../models/eshp/v1/address';
import formidable from 'formidable';

class Address extends BaseComponent {
    constructor() {
        super();
        this.addAddress = this.addAddress.bind(this);
    }

    async getAddress(req, res, next) {
        const user_id = req.params.user_id;
        if (!user_id || !Number(user_id)) {
            res.send({
                type: 'ERROR_USER_ID',
                message: 'user_id参数错误',
            });
            return;
        }

        try {
            const addressList = await AddressModel.find({user_id}, '-_id');
            res.send(addressList);
        } catch(err) {
            console.log('get address failed', err);
            res.send({
                type: 'ERROR_GET_ADDRESS',
                message: '获取地址列表失败'
            });
        }
    }

    async addAddress(req, res, next) {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const user_id = req.params.user_id;
            const {address, address_detail, geohash, name, phone, phone_bk, poi_type = 0, sex, tag, tag_type} = fields;
            try {
                if (!user_id || !Number(user_id)) {
                    throw new Error('user ID param error');
                } else if (!address) {
                    throw new Error('address info error');
                } else if (!address_detail) {
                    throw new Error('detail address info error');
                } else if (!geohash) {
                    throw new Error('geohash param error');
                } else if (!name) {
                    throw new Error('name error');
                } else if (!phone) {
                    throw new Error('phone error');
                } else if (!sex) {
                    throw new Error('sex error');
                } else if (!tag) {
                    throw new Error('tag error');

                } else if (!tag_type) {
                    throw new Error('tag type error');
                }
            } catch(err) {
                console.log(err.message);
                res.send({
                    status: 0,
                    type: 'GET_WRONG_PARAM',
                    message: err.message
                });
                return;
            }
            try {
                const address_id = await this.getId('address_id');
                const newAddress = {
                    id: address_id,
                    address, 
                    phone,
                    phone_bk: phone_bk&&phone_bk,
                    name,
                    st_geohash: geohash,
                    address_detail,
                    sex,
                    tag,
                    tag_type,
                    user_id,
                };
                await AddressModel.create(newAddress);
                res.send({
                    status: 1,
                    success: '添加地址成功'
                });
            } catch(err) {
                console.log('add address failed', err);
                res.send({
                    status: 0,
                    type: 'ERROR_ADD_ADDRESS',
                    message: '添加地址失败'
                })
            }
        })
    }

    async deleteAddress(req, res, next) {
        const {user_id, address_id} = req.params;
        if (!user_id || !Number(user_id) || !address_id || !Number(address_id)) {
            res.send({
                type: 'ERROR_PARAMS',
                message: '参数错误'
            });
            return;
        }

        try {
            await AddressModel.findOneAndRemove({id: address_id});
            res.send({
                status: 1,
                success: '删除地址成功',
            })
        } catch(err) {
            console.log('delete address failed', err);
            res.send({
                type: 'ERROR_DELETE_ADDRESS',
                message: '删除收获地址失败'
            })
        }
    }

    async getAddressById(req, res, next) {
        const address_id = req.params.address_id;
        if (!address_id || !Number(address_id)) {
            res.send({
                type: 'ERROR_PARAMS',
                message: '参数错误'
            });
            return;
        }

        try {
            const address = await AddressModel.findOne({id: address_id});
            res.send(address);
        } catch(err) {
            console.log('get address info failed', err);
            res.send({
                type: 'ERROR_GET_ADDRESS',
                message: '获取地址信息失败'
            });
        }
    }
}

export default new Address();
