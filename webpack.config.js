var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-source-map',
    entry: {
        'index': 'index'
    },
    resolve: {
        root: path.join(__dirname, 'app', 'client')
    },
    output: {
        path: path.join(__dirname, 'public'),
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader'
                // les presets sont dans le fichier .babelrc
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.scss$/i,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
            }
        ]
    },
    plugins: [

        // create global constants which can be configured at compile time
        new webpack.DefinePlugin({
            "process.env": {
                // this has effect on the react lib size
                NODE_ENV: JSON.stringify("production"),
                BROWSER: JSON.stringify(true)
            }
        }),
        // search for equal or similar files and deduplicate them in the output
        new webpack.optimize.DedupePlugin(),

        // minimize all JavaScript output of chunks
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),

        // separate css from bundled js
        new ExtractTextPlugin('stylesheets/[name].min.css'),

		// copie les fichiers specifies tels quels, dans le repertoire 'public'
		new CopyWebpackPlugin(
				[
					{
						context: path.join(__dirname, 'app', 'client', 'vendor'),
						from: 'tc_EI9_navigation.js'
					},
					{
						context: path.join(__dirname, 'app', 'client', 'vendor'),
						from: 'markerclusterer.js'
					}
				],
				{
					copyUnmodified: true
				}
		)

    ]
};
