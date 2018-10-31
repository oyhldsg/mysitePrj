'use strict';

import HongbaoModel from '../../../models/eshp/promotion/hongbao';
import BaseComponent from '../../../prototype/eshp/baseComponent';

class Hongbao extends BaseComponent {
    constructor() {
        super();
        this.getHongbao = this.getHongbao.bind(this);
        this.getExpiredHongbao = this.getExpiredHongbao.bind(this);
    }

    async getHongbao(req, res, next) {
        this.hongbaoHandle(req, res, 'intime');
    }

    async getExpiredHongbao(req, res, next) {
        this.hongbaoHandle(req, res, 'expired');
    }

    async hongbaoHandle(req, res, type) {
        const present_status = type == 'intime' ? 1 : 4;
        const user_id = req.param.user_id;
        const {limit = 0, offset = 0} = req.query;
        try {
            if (!user_id || !Number(user_id)) {
                throw new Error('user_id param error');
            } else if (!Number(limit)) {
                throw new Error('limit param error');
            } else if (typeof Number(offset) !== 'number') {
                throw new Error('offset param error');
            }
        } catch(err) {
            console.log(err.message, err);
            res.send({
                status: 0,
                type: 'ERROR_PARAMS',
                message: err.message
            });
            return;
        }

        try {
            const hongbaos = await HongbaoModel.find({present_status}, '-_id').limit(Number(limit)).skip(Number(offset));
            res.send(hongbaos);
        } catch(err) {
            console.log('get hongbao data failed');
            res.send({
                status: 0,
                type: 'ERROR_TO_GET_HONGBAO_DATA',
                message: 'get hongbao data failed'
            })
        }
    }

    async exchange(req, res, next) {
        res.send({
            status: 0,
            type: 'NOT_ALLOWD_API',
            message: 'invalid code'
        })
    }
}

export default new Hongbao();
