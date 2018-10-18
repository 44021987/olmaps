const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const mode = process.env.NODE_ENV

module.exports = {
  entry: {
    app: './package/index.js'
  },
  mode,
  output: {
    // library: 'olmap',
    libraryTarget: "umd",
    filename: 'index.js',
    chunkFilename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
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