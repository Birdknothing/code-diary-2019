
// ref: https://umijs.org/config/
export default {
  history: 'hash',
  base: '/',
  publicPath: '/web/',
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: {
        hmr: true,
      },
      dynamicImport: false,
      title: 'Edbox',
      dll: false,
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
      "sass":{},
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
  "theme": {
    "primary-color": "#da0301",
  },
  copy: [
    {
      from: 'favicon.ico',
      to: '',
    }
  ],
  targets: {
    ie: 11,
    edge: 12,
    firefox: 42
  },
}
