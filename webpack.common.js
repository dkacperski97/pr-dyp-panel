const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const options = {
    mode: process.env.NODE_ENV || 'development',
    entry: path.resolve(__dirname, './src/index.tsx'),
    devtool: process.env.NODE_ENV !== 'production' ? 'eval' : undefined,
    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
      },
      port: 3000,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },
    module: {
      rules: [
        {
          test: /bootstrap\.tsx$/,
          loader: "bundle-loader",
          options: {
            lazy: true,
          },
        },
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
      publicPath: "auto",
      uniqueName: 'panel',
      // path: path.resolve(__dirname, './dist'),
      // filename: '[name].js',
      // chunkFilename: '[name].chunk.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './public/index.html'),
        chunks: ["main"]
      }),
    ],
}

module.exports = options;