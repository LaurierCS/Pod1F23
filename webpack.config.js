const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    popup: "./src/popup.js",
    serviceWorker: "./src/serviceWorker.js",
    contentScript: "./src/contentScript.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "output"),
  },
  watch: true,
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "static" }],
    }),
  ],
  mode: "development",
  devtool: "inline-source-map"
};