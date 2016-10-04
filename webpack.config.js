const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');

const parts = require('./lib/parts');
const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
  src: path.join(__dirname, 'src', 'assets', 'js'),
  styles: path.join(__dirname, 'src', 'assets', 'css', 'main.css'),
  public: path.join(__dirname, 'public')
};

process.env.BABEL_ENV = TARGET;

const common = {
  entry: {
    src: PATHS.src,
    styles: PATHS.styles
  },
  output: {
    path: PATHS.public,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel?cacheDirectory'],
        include: PATHS.src
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: ['file', 'image-webpack']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Change This!!!',
      template: './src/index.html'
    })
  ]
};

var config;
switch(TARGET) {
case 'build':
  config = merge(
    common,
    {
      devtool: 'source-map',
      output: {
        path: PATHS.public,
        filename: './assets/js/[name].[chunkhash].js',
        chunkFilename: '[chunkhash].js'
      }
    },
    parts.clean(PATHS.public),
    parts.setFreeVariable(
      'process.env.NODE_ENV',
      'production'
    ),
    parts.minify(),
    parts.extractCSS(PATHS.styles)
  );
  break;
default:
  config = merge(
    common,
    {
      devtool: 'source-map'
    },
    parts.setupCSS(PATHS.styles),
    parts.devServer({
      host: process.env.HOST,
      port: process.env.PORT
    })
  );
}

module.exports = validate(config);
