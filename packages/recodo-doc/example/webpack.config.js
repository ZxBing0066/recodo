const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const htmlWebpackPlugin = new HTMLWebpackPlugin({ template: path.join(__dirname, './index.html'), nodeModules: false });

const webpackConfig = require('../webpack.config.js');

webpackConfig.plugins.push(htmlWebpackPlugin);
webpackConfig.entry = path.join(__dirname, './index.js');
delete webpackConfig.externals;
webpackConfig.devServer = {
    port: 9000,
    disableHostCheck: true,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    }
};
module.exports = webpackConfig;
