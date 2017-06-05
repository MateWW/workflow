const path = require("path");
const webpack = require("webpack");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ExtractText = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

 module.exports = function(env){

 	const prod= env !== undefined && env.production === true;

 	const extractBootstrap = new ExtractText('bootstrap.[contenthash].min.css');
 	const extractSCSS = new ExtractText('style.[contenthash].css');

	return {
		entry:{
			app:"./source/js/app.ts",
			vendors: ["pixi.js","firebase"]
		},

		output: {
			filename: prod ? "[name].[chunkhash].js":"[name].js",
			publicPath: "",
			path: path.resolve(__dirname, prod ? "./dist/":"./source/public/")			
		},
		devtool: prod ? false : "sourcemap" ,
		module:{
			rules:[
				{
					test: /\.ts(x?)$/,
					exclude: /node_modules/,
					loader: 'ts-loader'
				},
				{
					test: /\.js(x?)$/,
					exclude: /node_modules/,
					loader: 'babel-loader?presets[]=es2015'
				},
				{
					test: /\.s[ac]ss$/,
					exclude: /node_modules/,
					loader: extractSCSS.extract({
						fallback: 'style-loader',
						use: ['css-loader', 'postcss-loader','sass-loader?sourceMap=true']
					})
				},
				{
					test: /\.css$/,
					exclude: /node_modules/,
					loader: extractBootstrap.extract({
						fallback: 'style-loader',
						use: ['css-loader?sourceMap=true']
					})
				},
				{
 					test:/\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,	
	 				use:[
	 					"url-loader?limit=10000&name=[name].[hash].[ext]",
	 					"img-loader"
	 				]
 				}


			]


		},
		resolve: {
			extensions: ['.js', '.jsx', '.ts', '.tsx'],
		},
		plugins:[
			new BrowserSyncPlugin({
				host:'localhost',
				port:3000,
				server: {
				 baseDir:['./source/public']
				}
			}),
			extractBootstrap,
			extractSCSS,
			new HtmlWebpackPlugin({template:'./source/index.html'}),
			new webpack.optimize.CommonsChunkPlugin({
	 			name: "vendors"
	 		})
		],
	};


}