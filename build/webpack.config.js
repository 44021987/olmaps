const path = require('path')

const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const commonConfig = require('./config.js')
const outPath = path.resolve(process.cwd(), './lib')


console.log(path.resolve(process.cwd(), './lib'), '555555555555')

module.exports = {

  entry: {
    olmaps: './package/index.js'
  },
  output: {
    // library: 'olmap',
    libraryTarget: "umd",
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: outPath
  },
  plugins: [
    new CleanWebpackPlugin(['lib'], { root: path.resolve(__dirname, '..') }),
    new CopyWebpackPlugin([
      {
        from: 'node_modules/ol/ol.css',
        to: 'css'
      }
    ])
  ],
  ...commonConfig,

}