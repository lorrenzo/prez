'use strict';
var path = require("path");
module.exports = {
    entry: [
        './src/typescript/main.ts'
    ],
    output: {
        path: './src/dist',
        filename: 'javascript/bundle.js'
    },
    module: {
        rules: [
            { test: /\.ts$/, use: 'ts-loader' },
            { test: /.(png|woff(2)?|eot|ttf|svg|ico)(\?[a-z0-9=\.]+)?$/, loader: 'url-loader?limit=100000&name=images/[name].[ext]' }
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
    devtool: false
};