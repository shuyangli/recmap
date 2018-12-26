"use strict";

const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: "./src/index.tsx",
  mode: "production",
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/build"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, exclude: /node_modules/, use: "ts-loader" },
      { test: /\.less$/, exclude: /node_modules/, use: ["style-loader", "css-loader", "less-loader"] },
      { test: /\.css$/, exclude: /node_modules/, use: ["style-loader", "css-loader"] },
      { test: /\.(eot|ttf|woff|woff2)$/, use: "file-loader" }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
      "process.env.SERVER_HOST": JSON.stringify(process.env.SERVER_HOST),
      "process.env.GOOGLE_MAPS_KEY": JSON.stringify(process.env.GOOGLE_MAPS_KEY),
    }),
  ],
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
};
