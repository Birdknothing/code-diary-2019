
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  history: 'hash',
  publicPath: "/mobile/",
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'edbox-lobby-mobile',
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
      sass: {},
    },
    "import", {"libraryName": "antd-mobile", "style": true}],
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
    "brand-primary": "#da0301",
    "color-text-base":  "#333",
    "brand-primary": '#da0301',
    "brand-primary-tap": '#ae0201',
    "brand-wait": '#da0301',
    "color-text-base": '#000'
  },
  copy: [
    {
      from: 'favicon.ico',
      to: '',
    },
  ],
}
