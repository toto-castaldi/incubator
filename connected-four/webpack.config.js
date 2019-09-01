const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    plugins: [
        new CopyWebpackPlugin([{
            from: './*.html'
        }, {
            from: './*.css'
        }, {
            from: './*.png'
        }])
    ]
}