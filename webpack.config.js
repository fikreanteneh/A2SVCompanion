const CopyPlugin = require('copy-webpack-plugin');

const path = require('path');
const outputPath = 'dist';
const entryPoints = {
  main: [path.resolve(__dirname, 'src', 'main.ts')],
  services: path.resolve(__dirname, 'src', 'services.ts'),
  'auth.content': path.resolve(__dirname, 'src', 'content/auth.content.ts'),
  'leetcode.content': path.resolve(
    __dirname,
    'src',
    'content/leetcode.content.ts'
  ),
  'codeforces.content': path.resolve(
    __dirname,
    'src',
    'content/codeforces.content.ts'
  ),
  sidepanel: path.resolve(__dirname, 'src', 'sidepanel.ts')
};
module.exports = {
  entry: entryPoints,
  output: {
    path: path.join(__dirname, outputPath),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(jpg|jpeg|png|gif|woff|woff2|eot|ttf|svg)$/i,
        use: 'url-loader?limit=1024',
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: '.', to: '.', context: 'public' }],
    }),
  ],
};
