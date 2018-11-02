var path = require('path');

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../manage/index.html'),
        assetsRoot: path.resolve(__dirname, '../manage'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/manage/',
        productionSourceMap: false,
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: process.env.npm_config_report
    }
}

