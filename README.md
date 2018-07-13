## React Native for Web with React Navigation
This is an example application how to use React Navigation with React Native for Web. It's super simple so that it would be useful as boiler plate.

## How to run
```sh
$ git clone https://github.com/hayo0914/react-native-web-react-navigation-example
$ yarn install
$ yarn start
```

## How it looks
![img](https://i.gyazo.com/42ebfeeb64bf9df120e5312e618cd0e4.gif)

## Key points to use React Navigation with React Native for Web

- webpack settings
```js
// webpack settings for react-native-web and react-navigation
module.exports = {
  ...
  plugins: [
    new webpack.DefinePlugin({
      '__DEV__': false,
    }),
  ],
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

```

- add dependency for react-art
```sh
$ yarn add react-art
```

## License
MIT License.

