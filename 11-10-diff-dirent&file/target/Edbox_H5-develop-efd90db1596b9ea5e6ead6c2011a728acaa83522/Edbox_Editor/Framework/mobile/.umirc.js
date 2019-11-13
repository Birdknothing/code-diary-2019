const path = require('path')

export default {
  history: 'hash',
  publicPath: "/editor/mobile/",
  plugins: [
    [
      'umi-plugin-react',
      {
        dva: true,
        antd: true,
        hd: true,
        routes: {
          exclude: [
            /model\.(j|t)sx?$/,
            /service\.(j|t)sx?$/,
            /models\//,
            /components\//,
            /services\//
          ]
        },
        locale: {
          default: 'zh-CN', //默认语言 zh-CN
          baseNavigator: true, // 为true时，用navigator.language的值作为默认语言
          antd: true // 是否启用antd的<LocaleProvider />
        }
      },
      'import',
      { libraryName: 'antd-mobile', style: true }
    ]
  ],
  alias: {
    components: path.resolve(__dirname, 'src/components'),
    utils: path.resolve(__dirname, 'src/utils'),
    services: path.resolve(__dirname, 'src/services'),
    models: path.resolve(__dirname, 'src/models'),
    themes: path.resolve(__dirname, 'src/themes'),
    images: path.resolve(__dirname, 'src/assets'),
    widget: path.resolve(__dirname, 'src/widgetComponent')
  },
  theme: {
    'brand-primary': '#da0301',
    'brand-primary-tap': '#ae0201',
    'brand-wait': '#da0301',
    'color-text-base': '#000'
  }
}
