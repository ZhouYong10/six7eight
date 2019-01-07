"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UgligyjsWebpackPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
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
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve(__dirname, './client/commons/')
        }
    },
    module: {
        rules: [
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
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, distDev)
    },
    mode: 'development',
    devtool: 'eval-source-map',
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
}
else {
    module.exports = development;
}
//# sourceMappingURL=webpack.config.js.map