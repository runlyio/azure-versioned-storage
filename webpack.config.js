/* eslint-disable import/no-commonjs */

const path = require("path");

module.exports = {
	mode: "development",
	entry: "./src/index.js",
	target: "node",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "action.js"
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: {
					loader: "babel-loader"
				},
				include: [path.resolve("./src")]
			}
		]
	}
};
