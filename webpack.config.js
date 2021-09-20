const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ModuleFederationPlugin } = require('webpack').container;
const { MFLiveReloadPlugin } = require("@module-federation/fmr");
const deps = require('./package.json').dependencies;

const commonOptions = require('./webpack.common');

const options = {
  ...commonOptions,
  plugins: [
    ...commonOptions.plugins,
    new MFLiveReloadPlugin({
      port: 3000,
      container: "panel",
      standalone: true
    }),
    new ModuleFederationPlugin({
      name: "panel",
      remotes: {
        "output": "output@http://localhost:3001/remoteEntry.js"
      },
      shared: {
        "react": {
          singleton: true,
          // eager: true,
          requiredVersion: deps.react,
        }, 
        "react-dom": {
          singleton: true,
          // eager: true,
          requiredVersion: deps["react-dom"],
        },
        "@material-ui/core": {
          singleton: true,
        },
        "@material-ui/icons": {
          singleton: true,
        }, 
        "react-router-dom": {
          singleton: true,
        },
      }
    })
  ]
}

module.exports = options;