const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const createLoadableComponentsTransformer = require('typescript-loadable-components-plugin').default;

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
                test: /\.ts(x?)$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    getCustomTransformers: (program) => ({
                        before: [createLoadableComponentsTransformer(program, {})],
                    }),
                },
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
                test: [
                    /\.(ttf|eot|woff|woff2)$/,
                    /\.(mp3|aac)$/,
                    /\.svg/,
                    /\.(png|jpe?g|gif|ico)$/i,
                    /\.(xml)$/i,
                    /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/
                ],
                type: 'asset/resource',
                generator: {
                    filename: '[name][ext]'
                }
            },
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
        new LoadablePlugin()
    ]
};

module.exports = defaultConfig;
