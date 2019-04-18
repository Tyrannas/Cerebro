const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/main.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js'
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyPlugin([
			{ from: 'assets', to: '' }
		])
	]
};