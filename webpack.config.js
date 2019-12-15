const path = require('path');
const express = require('express');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'source-map',
  resolve: {
    alias: {
      Strategies: path.resolve(__dirname, 'src/strategies/'),
      '~': path.resolve(__dirname, 'src/')
    }
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    before (app, server, compiler) {
      app
        .get(
          /^\/assets\/.*\.(jpe?g|png|json)$/,
          express.static(path.join('src'), { redirect: false })
        );
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
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'modem_ website'
    })
  ]
};
