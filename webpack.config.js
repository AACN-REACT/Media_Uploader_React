const path = require("path");
const htmlwebpackplugin = require("html-webpack-plugin");
const cleanwebpackplugin = require("clean-webpack-plugin").CleanWebpackPlugin;
const miniextractplugin = require("mini-css-extract-plugin");
module.exports = function (env) {
  console.log(env);
  return {
    entry: { index: "./src/index.tsx" },
    output: {
      publicPath: "/",
      filename: "js/site.js",
      chunkFilename: "js/[name].js",
      path:
        env && env.production
          ? path.resolve(
              __dirname,
              "../../Aacn.VideoUploader.Presentation.React/wwwroot"
            )
          : path.resolve(__dirname, "dist"),
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", "jsx"],
    },
    devServer: {
      // historyApiFallback: true,
      contentBase: path.resolve(__dirname, "dist"),
      port: 8080,
      open: true,
    },
    optimization: {
      runtimeChunk: "single",
      splitChunks: {
        cacheGroups: {
          reactVendor: {
            chunks: "all",
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: "reactvendor",
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.(png|svg|jpg)$/,
          loader: "file-loader",
          options: {
            outputPath: "images",
            name: "[name][ext]",
          },
        },
        {
          test: /\.[tj]sx?/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-typescript", "@babel/preset-react", "@babel/preset-env"],
              },
            },
          ],
        },
        {
          test: /\.scss?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: miniextractplugin.loader,
            },
            "css-loader",
            "sass-loader",
          ],
        },
      ],
      // rules: [{ test: /\.tsx?/, exclude: /node_modules/, use: "ts-loader" }],
    },
    plugins: [
      new miniextractplugin({
        filename: "css/site.css",
      }),
      new htmlwebpackplugin({
        template: "./public/index.html",
      }),
    ],
  };
};
