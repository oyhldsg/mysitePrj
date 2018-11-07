'use strict';

import article from './blog/article';
import comment from './blog/comment';
import v1 from './eshp/v1';
import ugc from './eshp/ugc';
import bos from './eshp/bos';
import eus from './eshp/eus';
import admin from './eshp/admin';
import statis from './eshp/statis';
import member from './eshp/member';
import shopping from './eshp/shopping';
import promotion from './eshp/promotion';

export default app => {
    app.use('/blog/article', article);
    app.use('/blog/comment', comment);

    app.use('/eshp/v1', v1);
    app.use('/eshp/ugc', ugc);
    app.use('/eshp/bos', bos);
    app.use('/eshp/eus', eus);
    app.use('/eshp/admin', admin);
    app.use('/eshp/member', member);
    app.use('/eshp/statis', statis);
    app.use('/eshp/shopping', shopping);
    app.use('/eshp/promotion', promotion);
}
