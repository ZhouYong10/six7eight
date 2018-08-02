import path = require('path');
import webpack = require('webpack');
import merge = require('webpack-merge');
import VueLoaderPlugin = require('vue-loader/lib/plugin');
import HtmlWebpackPlugin = require('html-webpack-plugin');
import CleanWebpackPlugin = require('clean-webpack-plugin');
import MiniCssExtractPlugin = require('mini-css-extract-plugin');
import UgligyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
import OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
import {devConf} from "./config";

let common = {
    context: path.resolve(__dirname, 'client'),
    entry: {
        platform: './platform.ts',
        siteEnd: './siteEnd.ts',
        siteEndLogin: './siteEndLogin.ts',
        siteFront: './siteFront.ts'
    },
    plugins: [
        new VueLoaderPlugin(),
    ],
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
            vue$: 'vue/dist/vue.esm.js'  //使用vue完整版
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                include: path.resolve(__dirname, "./client/components"),
                loader: 'vue-loader'
            },
            {
                test: /\.tsx?$/,
                include: path.resolve(__dirname, "./client"),
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
};

const distDev = './dist';
let development = merge(common, {
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, distDev)
    },
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        contentBase: distDev,
        hot: true,
        hotOnly: true,
        host: devConf.clientIp,
        port: devConf.clientPort,
        watchOptions: {
            ignored: /^(?!.*client)/
        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.scss$/,
                use: ['vue-style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin([distDev]),
        new HtmlWebpackPlugin({
            filename: 'platform.html',
            template: 'platform.html',
            chunks: ['platform'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: 'siteFront.html',
            template: 'siteFront.html',
            chunks: ['siteFront'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: 'siteEnd.html',
            template: 'siteEnd.html',
            chunks: ['siteEnd'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: 'siteEndLogin.html',
            template: 'siteEndLogin.html',
            chunks: ['siteEndLogin'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: '404.html',
            template: '404.html',
            chunks: ['']
        })
    ],
    performance: {
        hints: 'warning'
    },
});

const distProd = './public/dist';
let production = merge(common, {
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, distProd),
        publicPath: '/dist/'
    },
    mode: 'production',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css",
            chunkFilename: "[id].[hash].css"
        }),
        new OptimizeCssAssetsPlugin(),
        new UgligyjsWebpackPlugin({
            sourceMap: true,
            cache: true,
            parallel: true
        }),
        new CleanWebpackPlugin([distProd]),
        new HtmlWebpackPlugin({
            filename: '../../views/platform.html',
            template: 'platform.html',
            chunks: ['platform'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: '../../views/siteFront.html',
            template: 'siteFront.html',
            chunks: ['siteFront'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: '../../views/siteEnd.html',
            template: 'siteEnd.html',
            chunks: ['siteEnd'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: '../../views/siteEndLogin.html',
            template: 'siteEndLogin.html',
            chunks: ['siteEndLogin'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: '../../views/404.html',
            template: '404.html',
            chunks: ['']
        })
    ],
    performance: {
        hints: 'warning'
    },
});

if (process.env.NODE_ENV === 'production') {
    module.exports = production;
} else {
    module.exports = development;
}