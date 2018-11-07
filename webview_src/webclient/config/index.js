var path = require('path');

module.exports = {
    build: {
        env: {
            NODE_ENV: '"production"'
        },
        index: path.resolve(__dirname, '../mysite/index.html'),
        assetsRoot: path.resolve(__dirname, '../mysite'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/mysite/',
        productionSourceMap: true,
        productionGzip: false,
        productionGzipExtensions: ['js', 'css']
    }
}
