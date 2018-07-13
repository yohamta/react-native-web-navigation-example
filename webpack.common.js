const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      '__DEV__': false,
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, './src'),
          path.resolve(__dirname, './node_modules/react-navigation'),
          path.resolve(__dirname, './node_modules/react-art'),
          path.resolve(__dirname, './node_modules/react-native-tab-view'),
          path.resolve(__dirname, './node_modules/react-native-paper'),
          path.resolve(__dirname, './node_modules/react-native-vector-icons'),
          path.resolve(__dirname, './node_modules/react-native-safe-area-view'),
          path.resolve(__dirname, './node_modules/@expo/samples'),
          path.resolve(__dirname, './node_modules/@expo/vector-icons'),
          path.resolve(
            __dirname,
            './node_modules/react-native-platform-touchable'
          ),
          path.resolve(__dirname, './node_modules/react-native-htmlview'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['react-native-web'],
            presets: ['react-native'],
          },
        },
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: 'file-loader',
        }
      }
    ],
  },
};
