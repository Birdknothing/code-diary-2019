
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  history: 'hash',
  publicPath: "/editor/web/",
  chainWebpack: function (config, { webpack }) {
    config.merge({
      optimization: {
        minimize: true,
        splitChunks: {
          chunks: 'async',
          minSize: 30000,
          maxSize: 0,
          minChunks: 1,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          automaticNameDelimiter: '~',
          name: true,
          cacheGroups: {
            vendors: {
              name: 'vendors',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|lodash|lodash-decorators|redux-saga|re-select|dva|moment)[\\/]/,
              priority: -10,
            },
            antdesigns: {
              name: 'antdesigns',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](@ant-design|antd)[\\/]/,
              priority: -11,
            }
          },
        },
      }
    });
  },
  plugins: [
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'Edbox',
      dll: false,
      chunks: ['vendors','antdesigns', 'umi'],
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
      locale: {
        default: 'zh-CN', //默认语言 zh-CN
        baseNavigator: true, // 为true时，用navigator.language的值作为默认语言
        antd: true // 是否启用antd的<LocaleProvider />
      },
      "sass": {},
      uglifyJSOptions: {
        warnings: false,
        drop_debugger: true,
        drop_console: true
      },
    }],
    ['umi-plugin-intl-hk', 
      {
        enable: true, // 插件开关，默认为fasle
        files: {
            sourceFile: 'zh_TW', // 需要复制的源文件
            destFile: 'zh_HK' // 需要生成的新文件
        }
      }
    ],
    [
      'umi-plugin-auto-tools', 
      {
        enable: true, // 插件开关，默认为fasle 
        timestampFiles: ['umi.css', 'umi.js']
      }
    ],
  ],
  targets: {
    ie: 11,
    firefox: 42,
    edge: 12
  },
  "theme": {
    "primary-color": "#da0301",
  },

}
