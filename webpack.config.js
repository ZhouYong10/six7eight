const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UgligyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const distDir = './dist';
let common = {
    context: path.resolve(__dirname, 'client'),
    entry: {
        index: './index.ts',
        platform: './platform.ts',
        siteEnd: './siteEnd.ts',
        siteFront: './siteFront.ts'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, distDir)
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                common: {
                    name: 'common',
                    chunks: "all",
                    minChunks: 2,
                    maxInitialRequests: 3,
                    minSize: 30000
                },
                vendor: {
                    name: 'vendor',
                    test: /node_modules/,
                    chunks: "all",
                    priority: 10,
                    enforce: true
                }
            }
        }
    },
    plugins: [
        new VueLoaderPlugin(),
        new CleanWebpackPlugin([distDir]),
        new HtmlWebpackPlugin({
            template: 'index.html',
            chunks: ['vendor', 'common', 'index'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: 'platform/index.html',
            template: 'platform.html',
            chunks: ['vendor', 'common', 'platform'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: 'siteFront/index.html',
            template: 'siteFront.html',
            chunks: ['vendor', 'common', 'siteFront'],
            chunksSortMode: 'dependency'
        }),
        new HtmlWebpackPlugin({
            filename: 'siteEnd/index.html',
            template: 'siteEnd.html',
            chunks: ['vendor', 'common', 'siteEnd'],
            chunksSortMode: 'dependency'
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
                test: /\.(sa|sc)ss$/,
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
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {

                        }
                    },
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
        hints: 'error'
    },
});

if (process.env.NODE_ENV === 'production') {
    module.exports = production;
} else {
    module.exports = development;
}