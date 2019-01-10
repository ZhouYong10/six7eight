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
        siteFront: './siteFront.ts',
        fof: './fof.ts',
    },
    output: {
        chunkFilename: '[name].[chunkhash].js',
    },
    optimization: {
        runtimeChunk: {
            name: "manifest"
        },
        splitChunks: {
            cacheGroups: {
                vue: {
                    test: /[\\/]vue[\\/]/,
                    name: "vue",
                    priority: -20,
                    chunks: "all"
                },
                elementUi: {
                    test: /[\\/]element-ui[\\/]/,
                    name: "element-ui",
                    priority: -20,
                    chunks: "all"
                },
                vueRouter: {
                    test: /[\\/]vue-router[\\/]/,
                    name: "vue-router",
                    priority: -20,
                    chunks: "all"
                },
                vuex: {
                    test: /[\\/]vuex[\\/]/,
                    name: "vuex",
                    priority: -20,
                    chunks: "all"
                },
                axios: {
                    test: /[\\/]axios[\\/]/,
                    name: "axios",
                    priority: -20,
                    chunks: "all"
                }
            }
        }
    },
    plugins: [
        new VueLoaderPlugin(),
    ],
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
            '@': path.resolve(__dirname, './client/commons/')
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
            },
            {
                test: /\.vue$/,
                include: path.resolve(__dirname, "./client"),
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
            },
            {
                test:  /\.(html)$/,
                loader: 'html-loader',
                options: {
                    minimize: true,
                    removeComments: true,
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
    devtool: 'cheap-module-eval-source-map',
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
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin([distDev]),
        new HtmlWebpackPlugin({
            filename: 'platform.html',
            template: 'platform.html',
            chunks: ['manifest', 'vue', 'element-ui', 'vue-router', 'vuex', 'axios', 'platform'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: 'siteFront.html',
            template: 'siteFront.html',
            chunks: ['manifest', 'vue', 'element-ui', 'vue-router', 'vuex', 'axios', 'siteFront'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: 'siteEnd.html',
            template: 'siteEnd.html',
            chunks: ['manifest', 'vue', 'element-ui', 'vue-router', 'vuex', 'axios', 'siteEnd'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: '404.html',
            template: '404/404.html',
            chunks: ['manifest', 'fof'],
            chunksSortMode: 'dependency'
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
    devtool: 'cheap-module-source-map',
    plugins: [
        new CleanWebpackPlugin([distProd]),
        new HtmlWebpackPlugin({
            filename: '../../views/platform.html',
            template: 'platform.html',
            chunks: ['manifest', 'vue', 'element-ui', 'vue-router', 'vuex', 'axios', 'platform'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: '../../views/siteFront.html',
            template: 'siteFront.html',
            chunks: ['manifest', 'vue', 'element-ui', 'vue-router', 'vuex', 'axios', 'siteFront'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: '../../views/siteEnd.html',
            template: 'siteEnd.html',
            chunks: ['manifest', 'vue', 'element-ui', 'vue-router', 'vuex', 'axios', 'siteEnd'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: '../../views/404.html',
            template: '404/404.html',
            chunks: ['manifest', 'fof'],
            chunksSortMode: 'dependency'
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