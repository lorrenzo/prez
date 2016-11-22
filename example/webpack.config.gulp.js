'use strict';
var path = require('path');

// /!\ En passant par webpack stream, on utilise un webpack 1.x.x et non 2.x.x

module.exports = {
    entry: {
        'main' : './src/javascript/main',
        'lolo' : './src/javascript/second'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            { test: /\.ts?$/ , loader: 'ts-loader' }
        ]
    },

    resolve: {
        modules:  [
            'node_modules',
            './src/javascript/'
        ],
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    devtool: false

};