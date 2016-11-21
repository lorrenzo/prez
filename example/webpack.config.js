'use strict';
var path = require('path');

module.exports = {
    entry: {
        'main': './src/javascript/main.ts'
    },

    output: {
        path: './src/dist',
        filename: '[name].bundle.js'
    },

    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader' },
            {
                test: /\.less$/,
                loader: extractLESS.extract(['css','postcss','less'])
            }
        ]
    },

    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'app')
        ],
        extensions: ['.ts', '.js']
    },

    devtool: false
};