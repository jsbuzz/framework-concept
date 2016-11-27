var path = require('path');
var fs = require('fs');

module.exports = {
  entry:  __dirname + "/flight/index.js",
  output: {
    path: __dirname,
    filename: "index.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel?presets[]=es2015'
      }
    ]
  },
  resolve: {
    root: path.resolve(__dirname),
    extensions: ['', '.js'],
  },
  externals: [
  ],
  plugins: [
  ],
};
