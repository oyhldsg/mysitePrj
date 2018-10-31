import express from 'express';
import config from 'config-lite';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import history from 'connect-history-api-fallback';
import chalk from 'chalk';

const app = express();

app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.Origin || req.headers.origin || 'http://www.zdevice.cn');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    /* can include cookies */
    res.header("Access-Control-Allow-Credentials", true);
    res.header("X-Powered-By", '1.0.0');

    if (req.method == 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

const MongoStore = connectMongo(session);
app.use(cookieParser());
app.use(session({
    name: config.session.name,
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    cookie: config.session.cookie,
    store: new MongoStore({
        url: config.url
    })
}));

router(app);

app.use(history());
app.use(express.static('./public'));
app.listen(config.port, () => {
    console.log(
            chalk.green(`success listen with port: ${config.port}`)
    )
});
