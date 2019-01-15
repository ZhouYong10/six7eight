"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const config_1 = require("./config");
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
                default: false,
                vue: {
                    test: /[\\/]vue[\\/]/,
                    name: "vue",
                    minSize: 0,
                    minChunks: 1,
                    reuseExistingChunk: true,
                    priority: 200,
                    chunks: "initial"
                },
                elementUi: {
                    test: /[\\/]element-ui[\\/]/,
                    name: "element-ui",
                    minSize: 0,
                    minChunks: 1,
                    reuseExistingChunk: true,
                    priority: 200,
                    chunks: "initial"
                },
                vueRouter: {
                    test: /[\\/]vue-router[\\/]/,
                    name: "vue-router",
                    minSize: 0,
                    minChunks: 1,
                    reuseExistingChunk: true,
                    priority: 200,
                    chunks: "initial"
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
                test: /\.(png|jpg|gif|svg|jpeg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true,
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: 'file-loader'
            },
            {
                test: /\.(html)$/,
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
        path: path.resolve(__dirname, distDev)
    },
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: distDev,
        hot: true,
        hotOnly: true,
        host: config_1.devConf.clientIp,
        port: config_1.devConf.clientPort,
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
            favicon: 'commons/images/icon.png',
            chunks: ['manifest', 'vue', 'element-ui', 'vue-router', 'vuex', 'axios', 'platform'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: 'siteFront.html',
            template: 'siteFront.html',
            favicon: 'commons/images/icon.png',
            chunks: ['manifest', 'vue', 'element-ui', 'vue-router', 'vuex', 'axios', 'siteFront'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: 'siteEnd.html',
            template: 'siteEnd.html',
            favicon: 'commons/images/icon.png',
            chunks: ['manifest', 'vue', 'element-ui', 'vue-router', 'vuex', 'axios', 'siteEnd'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: '404.html',
            template: '404/404.html',
            favicon: 'commons/images/icon.png',
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
        filename: '[chunkhash].js',
        chunkFilename: '[chunkhash].js',
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
            favicon: 'commons/images/icon.png',
            chunks: ['manifest', 'vue', 'element-ui', 'vue-router', 'vuex', 'axios', 'platform'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: '../../views/siteFront.html',
            template: 'siteFront.html',
            favicon: 'commons/images/icon.png',
            chunks: ['manifest', 'vue', 'element-ui', 'vue-router', 'vuex', 'axios', 'siteFront'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: '../../views/siteEnd.html',
            template: 'siteEnd.html',
            favicon: 'commons/images/icon.png',
            chunks: ['manifest', 'vue', 'element-ui', 'vue-router', 'vuex', 'axios', 'siteEnd'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: '../../views/404.html',
            template: '404/404.html',
            favicon: 'commons/images/icon.png',
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
}
else {
    module.exports = development;
}
//# sourceMappingURL=webpack.config.js.map