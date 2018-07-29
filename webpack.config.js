const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UgligyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const distDir = './public/dist';
let common = {
    context: path.resolve(__dirname, 'client'),
    entry: {
        platform: './platform.ts',
        platformLogin: './platformLogin.ts',
        siteEnd: './siteEnd.ts',
        siteEndLogin: './siteEndLogin.ts',
        siteFront: './siteFront.ts'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, distDir),
        publicPath: '/dist/'
    },
    plugins: [
        new VueLoaderPlugin(),
        new CleanWebpackPlugin([distDir]),
        new HtmlWebpackPlugin({
            filename: '../../views/platform.html',
            template: 'platform.html',
            chunks: ['platform'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: '../../views/platformLogin.html',
            template: 'platformLogin.html',
            chunks: ['platformLogin'],
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

let development = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
        contentBase: distDir,
        hot: true,
        hotOnly: true,
        host: '192.168.0.116',
        port: 4000
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
        new webpack.HotModuleReplacementPlugin()
    ],
    performance: {
        hints: 'warning'
    },
});

let production = merge(common, {
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