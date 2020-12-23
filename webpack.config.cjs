const path = require('path')
const nodeExternals = require('webpack-node-externals')

const config = {
  target: 'node',
  externals: [nodeExternals()],
  externalsType: "import",
  entry: {
    'app': './app.mjs'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    // libraryTarget: 'commonjs2'
  },
  module: {   //設定你的檔案選項
    rules: [
      {
        test: /\.(mjs|js)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
    ],
  },
  experiments: {
    topLevelAwait: true
  },
  resolve: {
    fallback: {
      http: require.resolve("http")
    }
  }
}

module.exports = config