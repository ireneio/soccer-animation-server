import * as path from 'path'
import nodeExternals from 'webpack-node-externals'

const __dirname = path.resolve(path.dirname(''))

const { nodeExternalsFunc } = nodeExternals

const config = {
  // target: 'node',
  externals: [nodeExternalsFunc()],
  entry: {
    'index': './app.mjs',
    'server': './bin/www.mjs'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.mjs',
    // libraryTarget: 'commonjs2',
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
  targets: {
    'node': 'current'
  },
  modules: false,
  externalsType: "import"
}

export default config