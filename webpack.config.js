const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

const options = {
    mode: process.env.NODE_ENV || 'development',
    entry: path.resolve(__dirname, './src/index.tsx'),
    devtool: process.env.NODE_ENV !== 'production' ? 'eval' : undefined,
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            },
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
          type: 'asset/inline',
        },
      ],
    },
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'bundle.js',
    },
    plugins: [
      new ModuleFederationPlugin({
        name: "output",
        remotes: {
          app_two: "app_two_remote",
          app_three: "app_three_remote"
        },
        exposes: {
          './AppContainer':'./src/App'
        },
        shared: ["react", "react-dom","react-router-dom","@material-ui/core","@material-ui/icons"]
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './public/index.html'),
        chunks: ["main"]
      }),
    ],
    stats: 'errors-only',
}

module.exports = options;