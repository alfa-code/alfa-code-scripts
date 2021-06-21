const path = require('path');
// const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

const rootPath = process.cwd();
// const scssRegex = /^((?!\.module).)*scss$/i;

const devConfig = {
    mode: 'development',
    output: {
        filename: 'app.js',
        path: path.join(rootPath, '.build/assets/'),
        publicPath: '/assets/'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: [/\.module\.scss$/],
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            modules: {
                                localIdentName: '[name]__[local]'
                            }
                        }
                    },
                    {
                        loader: require.resolve('sass-loader'),
                        options: {
                            sassOptions: {
                                includePaths: ['./src/styles']
                            }
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new WebpackBuildNotifierPlugin({
            title: "Alfa-Code - Client Side",
            logo: "/Users/avechkanov/Documents/web/alfa-code-platform/src/assets/images/other/avatar-example.png", // path.join(rootPath, './src/assets/images/other/avatar-example.png'),
            suppressSuccess: false, // don't spam success notifications
        })
    ]
};

module.exports = devConfig;
