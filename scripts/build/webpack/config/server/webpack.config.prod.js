const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const devConfig = {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.css$/,
                loader: require.resolve('null-loader'),
            },
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
        new FaviconsWebpackPlugin({
            outputPath: 'static/favicons',
            logo: 'src/assets/images/favicon.svg',
            cache: true,
        })
    ]
};

module.exports = devConfig;
