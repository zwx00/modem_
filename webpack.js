const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  resolve: {
    alias: {
      Strategies: path.resolve(__dirname, 'src/strategies/'),
      '~': path.resolve(__dirname, 'src/')
    }
  },
  output: {
    filename: 'main.js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ['@babel/plugin-transform-runtime',
                {
                  regenerator: true
                }
              ]
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      IMAGE_HOST: JSON.stringify('https://m-o-d-e-m.s3.eu-central-1.amazonaws.com')
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'modem',
      template: 'src/index.html'
    }),
    new CopyPlugin([
      { from: 'src/assets', to: 'assets' }
    ])
  ]
};
