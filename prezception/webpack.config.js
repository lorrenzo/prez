'use strict';
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractLESS = new ExtractTextPlugin('styles/main.css');

module.exports = {
    entry: [
        './src/typescript/main.ts',
        "./src/styles/main.less"
    ],
    output: {
        path: './src/dist',
        filename: 'javascript/bundle.js'
    },
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader' },
            {
                test: /\.less$/,
                loader: extractLESS.extract(['css-loader','less-loader'])
            },
            { test: /.(png|woff(2)?|eot|ttf|svg|ico)(\?[a-z0-9=\.]+)?$/, loader: 'url-loader?limit=100000&name=images/[name].[ext]' },
        ]
    },

    resolve: {
        modules:  [
            path.resolve('./typescript'),
            "node_modules"
        ],
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [ ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    plugins: [
        extractLESS
    ],
    devtool: false
};