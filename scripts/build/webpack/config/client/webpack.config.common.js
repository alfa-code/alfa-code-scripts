const path = require('path');
const webpack = require('webpack');
const fileLoader = require.resolve('file-loader');
const AssetsPlugin = require('assets-webpack-plugin');

const rootPath = process.cwd();

const defaultConfig = {
    context: path.resolve(rootPath, './src'),
    entry: {
        app: ['./client/index.tsx']
    },
    module: {
        rules: [
            {
                test: /\.worker\.ts$/,
                loader: 'worker-loader',
                options: { inline: 'no-fallback' }
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /^((?!\.module).)*scss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                loader: fileLoader,
                options: {
                    name: 'fonts/[name].[ext]'
                }
            },
            {
                test: /\.(mp3|aac)$/,
                loader: fileLoader,
                options: {
                    name: 'sounds/[name].[ext]'
                }
            },
            {
                test: /\.svg/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'svg/'
                    }
                }
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'images/'
                        }
                    },
                ],
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: (url) => {
                                return `fonts/${url}`;
                            }
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['jsx', '.tsx', '.ts', '.js', '.css', '.scss', '.sass', '.pcss', '.module.scss', '.svg', '.json'],
        alias: {
            Src: path.resolve(rootPath, './src'),
            Components: path.join(rootPath, './src/client/components/'),
            Containers: path.join(rootPath, './src/client/containers/'),
            Constants: path.join(rootPath, './src/constants/'),
            Assets: path.join(rootPath, './src/assets/'),
            Fonts: path.join(rootPath, './src/assets/fonts/'),
            Blocks: path.join(rootPath, './src/client/blocks/'),
            Forms: path.join(rootPath, './src/client/forms/'),
            Pages: path.join(rootPath, './src/client/pages/'),
            Actions: path.join(rootPath, './src/actions/'),
            Reducers: path.join(rootPath, './src/reducers/'),
            Selectors: path.join(rootPath, './src/selectors/'),
            Types: path.join(rootPath, './src/types/'),
            Utils: path.join(rootPath, './src/utils/'),
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
          }),
        new AssetsPlugin({
            filename: 'assets.client.json',
            path: path.join(rootPath, '.build/'),
            prettyPrint: true
        }),
    ]
};

module.exports = defaultConfig;
