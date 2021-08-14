const path = require("path");
//Webpack Analyzer
const WebpackBundleAnalyzer =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
  devtool: "eval-source-map",
  entry: "./src/index.ts",
  devServer: {
    contentBase: "./public",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        include: [path.resolve(__dirname, "src")],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/, ///< put all used node_modules modules in this chunk
          name: "vendor", ///< name of bundle
          chunks: "all", ///< type of code to put in this bundle
        },
      },
    },
  },
  output: {
    publicPath: "public",
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "public/compiled"),
  },
  //Add Analyzer Plugin alongside your other plugins...
  //plugins: [new WebpackBundleAnalyzer()],
};
