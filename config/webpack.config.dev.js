
const path = require('path');
const webpack = require('webpack');

const commonRules = [
  {
    test: /\.tsx?$/,
    use: 'ts-loader',
    exclude: /node_modules/
  }
];

const resolve = {
  extensions: [ '.tsx', '.ts', '.js' ],
  alias: {
    img: path.resolve(__dirname, '../src/assets/images'),
  },
};

const client = {
  mode: 'development',
  entry: './src/js/client.tsx',
  devtool: 'inline-source-map',
  watch: true,
  output: {
    filename: "client.bundle.js",
    path: path.resolve(__dirname, '..', 'dist'),
  },
  module: {
    rules: [
      ...commonRules,
      {
        test: /\.(jpg|svg|png|ico|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'images/[name]-[hash:base64:5].[ext]'
          }
        }]
      },
    ],
  },
  resolve,
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3001,
    compress: true,
    hot: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      __WEB__: true,
      __SERVER__: false,
      __DEV__: true,
    }),
  ],
};

const server = {
  mode: 'development',
  target: 'node',
  entry: './src/js/server.tsx',
  watch: true,
  output: {
    filename: "server.bundle.js",
    path: path.resolve(__dirname, '..', 'dist'),
    libraryTarget: 'commonjs',
  },
  module: {
    rules: [
      ...commonRules,
      {
        test: /\.(jpg|svg|png|ico|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'images/[name]-[hash:base64:5].[ext]',
            emitFiles: false,
          }
        }]
      },
    ],
  },
  resolve,
  plugins: [
    new webpack.DefinePlugin({
      __WEB__: false,
      __SERVER__: true,
      __DEV__: true,
    }),
  ],
};

module.exports = [client, server];