const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/main.ts',
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      src: path.resolve(__dirname, 'src'),
      '@libs': path.resolve(__dirname, 'libs'),
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
};
