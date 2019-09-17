const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  module: {
    rules: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.(png|jpe?g|gif|wav|ttf)$/i, loader: 'file-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '3D Terrain',
      template: 'src/index.html',
      repo: 'https://github.com/toto-castaldi/3d-terrain'
    })
  ]

}