'use strict';

import ExplainModel from '../../../models/eshp/v1/explain';

class Explain {
    constructor() {

    }

    async getExplain(req, res, next) {
        try {
            const explain = await ExplainModel.findOne();
            res.send(explain.data);
        } catch(err) {
            console.log('get server data failed', err);
            res.send({
                status: 0,
                type: 'ERROR_GET_SERVER_DATA',
                message: '获取服务中心数据失败'
            });
        }
    }
}

export default new Explain();
