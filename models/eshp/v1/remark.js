'use strict';

import mongoose from 'mongoose';
import remarkData from '../../../InitData/eshp/remark';

const Schema = mongoose.Schema;

const remarkSchema = new Schema({
    remarks: [],
});

const Remark = mongoose.model('Remark', remarkSchema);

Remark.findOne((err, data) => {
    if (!data) {
        Remark.create(remarkData);
    }
});

export default Remark;
