const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const mode = process.env.NODE_ENV

module.exports = {
  entry: {
    olmaps: './package/index.js'
  },
  mode,
  output: {
    // library: 'olmap',
    libraryTarget: "umd",
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, 'test/src')
  },
  plugins: [
    new CleanWebpackPlugin(['test/src']),
    new CopyWebpackPlugin([
      {
        from: 'node_modules/ol/ol.css',
        to: 'css'
      }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 81920
            }
          }
        ]
      }
    ]
  }
}