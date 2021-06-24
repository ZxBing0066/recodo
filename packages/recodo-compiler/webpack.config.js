const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProd = process.env.NODE_ENV === 'production';
const isAnalyzer = !!process.env.ANALYZER;

const packageName = require('./package.json').name;

const webpackConfig = {
    entry: path.join(__dirname, './index.js'),
    output: {
        filename: 'main.min.js',
        path: path.resolve(__dirname, 'dist'),
        library: packageName,
        libraryTarget: 'umd'
    },
    optimization: {},
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        configFile: path.resolve(__dirname, '../../.babelrc')
                    }
                }
            }
        ]
    },
    mode: process.env.NODE_ENV || 'development',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },
    devtool: isProd ? 'source-map' : 'eval-source-map',
    plugins: []
};

if (isAnalyzer) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

if (isProd) {
    webpackConfig.devtool = false;
    webpackConfig.optimization.minimize = true;
}

module.exports = webpackConfig;
