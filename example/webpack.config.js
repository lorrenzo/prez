'use strict';
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractLESS = new ExtractTextPlugin('./src/styles/main.css');

module.exports = {
    entry: [
        './src/javascript/main.ts',
        "./src/styles/main.less"
    ]
    ,
    output: {
        path: './src/dist',
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader' },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract(['css-loader','less-loader'])
            }
        ]
    },

    resolve: {
        modules:  [
            'node_modules',
            path.resolve('./src/javascript')
        ],
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [ ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    plugins: [
        new ExtractTextPlugin("styles.css")
    ],
    devtool: false
};