"use strict";

const config = require("./webpack.config");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  ...config,
  mode: "development",
  optimization: {},
  devtool: "inline-source-map",
  module: {
    ...config.module,
    rules: [
      config.module.rules[0],
      { test: /\.less$/, exclude: /node_modules/, use: ["style-loader", "css-loader", "less-loader"] },
      { test: /\.css$/, exclude: /node_modules/, use: ["style-loader", "css-loader"] },
      ...config.module.rules.slice(3),
    ]
  },
  plugins: config.plugins.filter(plugin => !(plugin instanceof MiniCssExtractPlugin)),
}
