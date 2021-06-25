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
    // },
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
