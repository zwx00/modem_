const path = require('path');
const express = require('express');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const prodWebpackConfig = require('./webpack');

module.exports = {
  ...prodWebpackConfig,
  mode: 'development',
  devtool: 'source-map',
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
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'modem_ website'
    })
  ]
};
