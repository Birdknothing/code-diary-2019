const path = require('path')
const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const autoExternal = require('rollup-plugin-auto-external')
const json = require('rollup-plugin-json')
const babel = require('rollup-plugin-babel')
const builtins = require('rollup-plugin-node-builtins')
const globals = require('rollup-plugin-node-globals')

module.exports = {
  input: path.resolve(__dirname, './index.js'),
  plugins: [
    resolve(),
    commonjs({
      include: /.\/node_modules/
    }),
    json(),
    autoExternal({
      dependencies: false,
      builtins: false
    }),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true
    }),
    globals(),
    builtins()
    // autoExternal()
  ],
  output: {
    name: 'SdpWalletSDK',
    file: path.resolve(__dirname, './dist/sdpwalletsdk.js'),
    format: 'umd'
  }
}
