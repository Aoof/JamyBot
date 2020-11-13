const path = require('path')
const webpack = require('webpack')

module.exports = {
    entry: path.resolve(__dirname, 'frontend-js/main.js'),
    output: {
        filename: 'main-bundled.js',
        path: path.resolve(__dirname, 'static/js')
    },
    mode: "development",
    devtool: 'inline-source-map',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    }
}