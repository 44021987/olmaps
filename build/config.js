const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const mode = process.env.NODE_ENV
const idDev = mode === 'development'
module.exports = {
  mode,
  optimization: {
    minimizer: idDev ? [] : [
      new UglifyJsPlugin({
        uglifyOptions: {
          //删除注释
          output: {
            comments: false
          },
          // 移除 console
          // 其它优化选项 https://segmentfault.com/a/1190000010874406
          warnings: false,
          toplevel: true,
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log']
          }
        },
        sourceMap: false,
        parallel: true
      })
    ]
  },
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