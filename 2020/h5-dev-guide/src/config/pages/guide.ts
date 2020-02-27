import packageJSON from "../codes/package.json";
const page_guide = [
  {
    type: "title_p",
    title: [
      "h2",
      '安装<a href="http://www.nodejs.cn" target="_blank">node</a>'
    ],
    content: [
      "安装node版本大于<version>8.0.0</version>，默认自带包管理工具npm",
      "将node添加至用户变量或全局变量"
    ]
  },
  {
    type: "code",
    content: [
      '$ <span class="yellow">node</span> -v',
      '$ <span class="yellow">npx</span> -v',
      "v10.16.3  v6.13.7"
    ]
  },
  { type: "quote", content: ["npx可以防止安装的包升级为全局变量"] },
  {
    type: "title_p",
    title: ["h2", "创建目录结构"],
    content: [
      "src目录用来存储开发模式代码，dist用来存储打包后的代码",
      "以linux系统为例创建模版html和入口页index.tsx，以及配置文件webpack.config.js,package.json,tsconfig.json"
    ]
  },
  {
    type: "code",
    content: [
      '$ <span class="yellow">mkdir</span> dist src src/components template',
      '$ <span class="yellow">touch</span> package.json webpack.config.js template/index.html src/index.tsx tsconfig.json'
    ]
  },
  {
    type: "title_p",
    title: [],
    content: ["可用的package.json示例："]
  },
  {
    type: "codeExtend",
    content: [JSON.stringify(packageJSON, null, 3)]
  },
  {
    type: "title_p",
    title: [],
    content: ["在同级目录下使用npm或yarn安装配置包"]
  },
  {
    type: "code",
    content: [
      '$ <span class="yellow">npm</span> install',
      '$ <span class="yellow">yarn</span>'
    ]
  },
  {
    type: "title_p",
    title: [],
    content: [
      "可用的webpack.config.js示例配置和tsconfig.json配置都可在相应官网找到",
      "通过package.json内scripts内的脚本配置可以快速选择启动模式是开发（浏览器热更新），或者是生产模式（打包到dist目录）："
    ]
  },
  {
    type: "code",
    content: [
      '$ <span class="yellow">npm</span> run dev',
      '$ <span class="yellow">npm</span> run build'
    ]
  }
];
export { page_guide };
