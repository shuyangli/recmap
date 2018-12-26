"use strict";

const config = require("./webpack.config");

module.exports = {
  ...config,
  mode: "development",
  optimization: {},
  devtool: "inline-source-map",
}
