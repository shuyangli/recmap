"use strict";

const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const { forEach } = require("lodash");

const environment = {
  "process.env": "{}",
};
forEach(process.env, (value, key) => {
  environment["process.env." + key]= JSON.stringify(value);
});

module.exports = {
  entry: "./src/index.tsx",
  mode: "production",
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/"
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
    new webpack.DefinePlugin(environment),
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
