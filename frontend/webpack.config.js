var path = require("path");

module.exports = {
  entry: {
    app: "./src/index.tsx"
  },
  output: {
    // Output path
    path: path.resolve(__dirname, "build"),
    // [name] is interpolated from the original filename
    filename: "[name].js",
    publicPath: "/build/"
  },
  devtool: "source-map",
  resolve: {
    // What extensions should webpack load?
    extensions: ["", ".js", ".webpack.js", ".web.js", ".json", ".ts", ".tsx"],
    alias: {
      "webworkify": "webworkify-webpack"
    }
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: "style!css" },
      // files with .ts / .tsx extensions get passed through ts-loader
      { test: /\.tsx?$/, loader: "ts-loader" },
      { test: /\.json$/, loader: "json-loader" },
      {
        test: /\.js$/,
        include: path.resolve("node_modules/mapbox-gl-shaders/index.js"),
        loader: "transform/cacheable?brfs"
      }
    ],
    preLoaders: [
      // all output .js files will have sourcemaps processed by source-map-loader
      { test: /\.js$/, loader: "source-map-loader" }
    ],
    postLoaders: [{
      include: path.resolve("node_modules\/mapbox-gl-shaders/"),
      loader: "transform",
      query: "brfs"
    }]
  }
};
