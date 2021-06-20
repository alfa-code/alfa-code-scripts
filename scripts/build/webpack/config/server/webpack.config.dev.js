// const path = require('path');

// const rootPath = process.cwd();
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');

const devConfig = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: require.resolve('null-loader'),
            },
            // {
            //     test: /\.css$/,
            //     use: [
            //         // 'style-loader',
            //         'css-loader'
            //     ],
            // },
            // {
            //     loader: require.resolve('css-loader'),
            //     options: {
            //         modules: true,
            //         exportOnlyLocals: true,
            //         getLocalIdent: getCSSModuleLocalIdent
            //     },
            // }
            {
                test: [/\.module\.scss$/],
                use: [
                    // require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            modules: {
                                exportOnlyLocals: true,
                                // localIdentName: '[name]__[local]___[hash:base64:5]'
                                localIdentName: '[name]__[local]'
                                // localIdentName: '[hash:base64]'
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
        })
    ]
};

module.exports = devConfig;