// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  history: 'hash',
  publicPath: "/editor/mobile_widget/",
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: false,
      title: 'edbox-mobile-widget',
      dll: false,
      locale: {
        enable: true,
        default: 'en-US',
      },
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  theme: {
    'brand-primary': '#c40100',
    'brand-primary-tap': '#da3938'
  },
}
