const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HTMLWebpackPlugin = require('html-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isAnalyzer = !!process.env.ANALYZER;

const packageName = require('./package.json').name;

const webpackConfig = {
    entry: path.join(__dirname, './index.js'),
    output: {
        filename: '[name].min.js',
        path: path.resolve(process.cwd(), 'build', packageName),
        library: packageName,
        libraryTarget: 'umd'
    },
    devtool: isProd ? 'source-map' : 'eval-source-map',
    mode: process.env.NODE_ENV || 'development',
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx', '.json']
    },
    // externals: {
    //     react: {
    //         root: 'React',
    //         amd: 'react',
    //         commonjs: 'react',
    //         commonjs2: 'react'
    //     },
    //     'react-dom': {
    //         root: 'ReactDOM',
    //         amd: 'react-dom',
    //         commonjs: 'react-dom',
    //         commonjs2: 'react-dom'
    //     }
    // },
    plugins: [
        ...(isAnalyzer ? [new BundleAnalyzerPlugin()] : []),
        new HTMLWebpackPlugin({ template: path.join(__dirname, './index.html'), nodeModules: false }),
        new webpack.DefinePlugin({
            'process.env.BABEL_TYPES_8_BREAKING': JSON.stringify(process.env.NODE_ENV)
        })
    ],
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        configFile: path.resolve(__dirname, '../../.babelrc')
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    },
    devServer: {
        port: 9000,
        disableHostCheck: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        }
    },
    node: {
        fs: 'empty'
    }
};

module.exports = webpackConfig;
