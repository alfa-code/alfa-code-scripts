const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

const devConfig = {
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: require.resolve('null-loader'),
            },
            {
                test: [/\.module\.scss$/],
                use: [
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            modules: {
                                exportOnlyLocals: true,
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
        new WebpackBuildNotifierPlugin({
            title: "Alfa-Code - Server Side",
            logo: "/Users/avechkanov/Documents/web/alfa-code-platform/src/assets/images/other/avatar-example.png", // path.join(rootPath, './src/assets/images/other/avatar-example.png'),
            suppressSuccess: false, // don't spam success notifications
        }),
    ]
};

module.exports = devConfig;
