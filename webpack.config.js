const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UgligyjsWebpackPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const distDir = './webDist';
let common = {
    context: path.resolve(__dirname, 'client'),
    entry: {
        main: './index.ts'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, distDir)
    },
    plugins: [
        new VueLoaderPlugin(),
        new CleanWebpackPlugin([distDir]),
        new HtmlWebpackPlugin({
            title: '这是首页',
            template: 'index.html'
        })
    ],
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
            vue$: 'vue/dist/vue.esm.js'  // 声明使用的vue版本（webpack默认使用vue.runtime.esm.js）
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
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
                test: /\.css$/,
                loader: 'style-loader!css-loader'
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
        hotOnly: true
    },
    module: {
        rules: [
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
                test: /\.(sa|sc)ss$/,
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
            filename: 'style.css'
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