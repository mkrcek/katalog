const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  mode: 'development',
  // mode: 'production',
  entry: [
    './src/index.js'
  ],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  // plugins: [
  //   new UglifyJsPlugin()
  // ],

  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015', 'stage-1']
      }
    }]
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  },
  devServer: {
  port: 1818
  }

};
