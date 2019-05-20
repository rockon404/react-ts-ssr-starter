
const path = require('path');
const webpack = require('webpack');
const AssetsPlugin = require('assets-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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
  mode: 'production',
  entry: {
    client: './src/js/client.tsx',
  },
  output: {
    filename: '[name].bundle.[chunkhash].js',
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
    ]
  },
  resolve,
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /node_modules/
        },
      }
    }
  },
  plugins: [
    new AssetsPlugin({ filename: 'assets.json', path: path.join(__dirname, '..', 'dist') }),
    new webpack.DefinePlugin({
      __WEB__: true,
      __SERVER__: false,
      __DEV__: false,
    }),
    new BundleAnalyzerPlugin(),
  ],
  devServer: {
    contentBase: path.join(__dirname, '..', 'dist'),
    port: 3001,
    compress: true,
  }
};

const server = {
  mode: 'production',
  target: 'node',
  entry: {
    server: './src/js/server.tsx',
  },
  output: {
    filename: "[name].bundle.js",
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
            emitFile: false,
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
      __DEV__: false,
    }),
  ],
};

module.exports = [client, server];