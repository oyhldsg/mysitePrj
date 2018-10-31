'use strict';

import EntryModel from '../../../models/eshp/v1/entry';

class Entry {
    constructor() {
    }

    async getEntry(req, res, next) {
        try {
            const entries = await EntryModel.find({}, '-_id');
            res.send(entries);
        } catch(err) {
            console.log('get data failed');
            res.send({
                status: 0,
                type: 'ERROR_DATA',
                message: '获取数据失败'
            });
            return;
        }
    }
}

export default new Entry();
