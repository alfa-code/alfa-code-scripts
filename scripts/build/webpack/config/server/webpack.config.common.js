const nodeExternals = require('webpack-node-externals');
const createLoadableComponentsTransformer = require('typescript-loadable-components-plugin').default;
const LoadablePlugin = require('@loadable/webpack-plugin');

const path = require('path');

const rootPath = process.cwd();

const buildPath = path.join(rootPath, '.build');

const defaultConfig = {
    target: 'node',
    entry: './src/server/index.ts',
    output: {
        filename: 'server.js',
        path: buildPath,
        publicPath: '/',
        assetModuleFilename: 'static/[name][ext]'
    },
    module: {
        rules: [
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
                    emit: false,
                },
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.css', '.scss', '.sass', '.pcss', '.module.scss', '.svg'],
        alias: {
            Src: path.join(rootPath, './src/'),
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
        }
    },
    externals: [nodeExternals({
        // this WILL include `jquery` and `webpack/hot/dev-server` in the bundle, as well as `lodash/*`
        allowlist: []
    })],
    plugins: [new LoadablePlugin()]
};

module.exports = defaultConfig;
