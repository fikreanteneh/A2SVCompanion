const CopyPlugin = require("copy-webpack-plugin");

const path = require("path");
const outputPath = "dist";
const entryPoints = {
  main: [path.resolve(__dirname, "src", "main.ts")],
  services: path.resolve(__dirname, "src", "services.ts"),
  "leetcode.content": path.resolve(
    __dirname,
    "src",
    "leetcode/leetcode.content.ts"
  ),
  "codeforces.content": path.resolve(
    __dirname,
    "src",
    "codeforces/codeforces.content.ts"
  ),
  "a2svhub.content": path.resolve(
    __dirname,
    "src",
    "a2sv/a2sv.content.ts"
  ),
};
module.exports = {
  entry: entryPoints,
  output: {
    path: path.join(__dirname, outputPath),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(jpg|jpeg|png|gif|woff|woff2|eot|ttf|svg)$/i,
        use: "url-loader?limit=1024",
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: ".", to: ".", context: "public" }],
    }),
  ],
};
