
// ref: https://umijs.org/config/
export default {
  history: 'hash',
  base: '/',
  publicPath: './',
  treeShaking: true,
  sass: {},
  "theme": {
    "primary-color": "#da0301",
  },
  targets: {
    ie: 11,
    edge: 12,
    firefox: 42
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'edbox-novice-guidance',
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
}
