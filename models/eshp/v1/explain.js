'use strict';

import mongoose from 'mongoose';
import explainData from '../../../InitData/eshp/explain';

const Schema = mongoose.Schema;

const explainSchema = new Schema({
    data: Schema.Types.Mixed,
});

const Explain = mongoose.model('Explain', explainSchema);

Eplain.findOne((err, data) => {
    if (!data) {
        Explain.create({data: explainData});
    }
});

export default Explain;