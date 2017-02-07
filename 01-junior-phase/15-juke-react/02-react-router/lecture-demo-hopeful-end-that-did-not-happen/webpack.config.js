'use strict';

var webpack = require('webpack');

module.exports = {
  entry: './browser/app.js',
  output: {
    path: __dirname,
    filename: './bundle.js'
  },
  context: __dirname,
  module: {
    loaders: [
      {
        test: /jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ]
  }
};
