"use strict";

const path = require("path");

module.exports = {
  entry: "./src/index.tsx",
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
  devtool: "inline-source-map"
}
