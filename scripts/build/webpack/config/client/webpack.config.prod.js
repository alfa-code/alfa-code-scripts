const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const rootPath = process.cwd();

const devConfig = {
    mode: 'production',
    optimization: {
        minimizer: [
            new UglifyJsPlugin(),
            new CssMinimizerPlugin(),
        ],
    },
    output: {
        filename: 'app.[hash].js',
        path: path.join(rootPath, '.build/static/'),
        publicPath: '/static/'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false
                        }
                    }
                ]
            },
            {
                test: [/\.module\.scss$/],
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            modules: {
                                // localIdentName: '[name]__[local]___[hash:base64:5]',
                                localIdentName: '[name]__[local]',
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
            filename: '[name].[hash].css',
            chunkFilename: '[id].css',
        }),
        new HtmlWebpackPlugin()
    ]
};

module.exports = devConfig;
