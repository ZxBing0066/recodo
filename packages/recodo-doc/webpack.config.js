const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProd = process.env.NODE_ENV === 'production';
const isAnalyzer = !!process.env.ANALYZER;

const packageName = require('./package.json').name;

const webpackConfig = {
    entry: path.join(__dirname, './src/index.tsx'),
    output: {
        filename: '[name].min.js',
        path: path.resolve(__dirname, 'dist'),
        library: packageName,
        libraryTarget: 'umd'
    },
    devtool: isProd ? 'source-map' : 'eval-source-map',
    mode: process.env.NODE_ENV || 'development',
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx', '.json']
    },
    plugins: [
        ...(isAnalyzer ? [new BundleAnalyzerPlugin()] : []),
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
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
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
    externals: {
        react: {
            root: 'React',
            amd: 'react',
            commonjs: 'react',
            commonjs2: 'react'
        },
        'react-dom': {
            root: 'ReactDOM',
            amd: 'react-dom',
            commonjs: 'react-dom',
            commonjs2: 'react-dom'
        },
        '@rapiop/mod': {
            root: 'mod',
            amd: '@rapiop/mod',
            commonjs: '@rapiop/mod',
            commonjs2: '@rapiop/mod'
        }
    },
    node: {
        fs: 'empty'
    }
};

module.exports = webpackConfig;
