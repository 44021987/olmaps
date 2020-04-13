const path = require('path')
const commonConfig = require('./config.js')
const outPath = path.resolve(process.cwd(), './lib')
module.exports = {
  entry: {
    olmaps: './src/map.js',
  },
  output: {

    libraryTarget: 'commonjs2',
    // filename: '[name].common.js',
    filename: 'index.js',
    chunkFilename: '[id].js',
    path: outPath
  },
  ...commonConfig
}