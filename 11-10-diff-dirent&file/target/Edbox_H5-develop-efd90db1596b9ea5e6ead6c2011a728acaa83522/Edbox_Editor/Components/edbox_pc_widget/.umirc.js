// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  history: 'hash',
  publicPath: '/editor/pc_widget/',
  //base: "editor/",
  chainWebpack: function(config, { webpack }) {
    config.optimization.splitChunks({
      chunks: 'all',
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
        },
      },
    });
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: false,
        title: 'Edbox_complex_component',
        dll: false,
        locale: {
          enable: true,
          default: 'en-US',
        },
        chunks: ['vendors', 'antdesigns', 'umi'],
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
    [
      'umi-plugin-intl-hk',
      {
        enable: true, // 插件开关，默认为fasle
        files: {
          sourceFile: 'zh_TW', // 需要复制的源文件
          destFile: 'zh_HK', // 需要生成的新文件
        },
      },
    ],
    [
      'umi-plugin-auto-tools',
      {
        enable: true, // 插件开关，默认为fasle
        reservedFiles: [
          'static/js/gif.js',
          'static/js/gif.worker.js',
          'static/js/recorder.mp3.min.js',
        ], // 可选项，配置需要保留的相对于dist文件夹的文件列表，Version.txt可以不用配置，默认直接支持保留
        timestampFiles: ['umi.css', 'umi.js'],
      },
    ],
  ],
  theme: {
    'primary-color': '#c40100',
  },
  copy: [
    {
      from: 'src/assets/js/',
      to: 'static/js/',
    },
  ],
  targets: {
    chrome: 53,
    firefox: 42,
    safari: 11,
    edge: 12,
    ie: 11,
  },
};
