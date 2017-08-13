"use strict";

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "app.js",
    path: __dirname + "/build"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, exclude: /node_modules/, loader: "ts-loader" },
      { test: /\.less$/, exclude: /node_modules/, loader: ["style-loader", "css-loader", "less-loader"] },
      { test: /\.css$/, exclude: /node_modules/, loader: ["style-loader", "css-loader"] },
      { test: /\.(eot|ttf|woff|woff2)$/, loader: require.resolve("file-loader") + "?name=assets/fonts/[name].[ext]" }
    ]
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  }
}
