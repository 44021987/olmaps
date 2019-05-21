const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const mode = process.env.NODE_ENV

module.exports = {
  entry: {
    olmaps: './package/index.js',
    map: './src/map.js'
  },
  mode,
  output: {
    // library: 'olmap',
    libraryTarget: "umd",
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.resolve(__dirname, 'lib/js')
  },
  plugins: [
    new CleanWebpackPlugin(['./lib/js']),
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
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
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