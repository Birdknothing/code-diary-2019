export default {
  namespace: "list",
  state: {
    name: "展昭",
    listTypeIndex: 0,
    listTypeArr: [
      { title: "我的作品", prop: "myWork" },
      { title: "在线作品", prop: "onlineWork" }
    ],
    tagTypeArr: [
      { title: "全部", tag: "all" },
      { title: "精品区", tag: "special" },
      { title: "VR区", tag: "vr" },
      { title: "古诗", tag: "poem" }
    ],
    myWork: [
      {
        id: "12",
        title: "英语：在农村",
        belong: "资源管理部",
        content: "说明"
      },
      {
        id: "11",
        title: "水体污染",
        belong: "资源管理部",
        content: "说明"
      },
      {
        id: "13",
        title: "水体污染",
        belong: "资源管理部",
        content: "说明"
      },
      {
        id: "14",
        title: "水体污染",
        belong: "资源管理部",
        content: "说明"
      },
      {
        id: "101",
        title: "水体污染",
        belong: "资源管理部",
        content: "说明"
      },
      {
        id: "102",
        title: "水体污染",
        belong: "资源管理部",
        content: "说明"
      },
      {
        id: "104",
        title: "水体污染",
        belong: "资源管理部",
        content: "说明"
      },
      {
        id: "105",
        title: "水体污染",
        belong: "资源管理部",
        content: "说明"
      },
      {
        id: "201",
        title: "Heart心脏",
        belong: "华渔",
        content: "说明"
      }
    ],
    onlineWork: [
      {
        id: "141",
        title: "英语：在农村",
        belong: "资源管理部",
        content: "说明"
      },
      {
        title: "煤的形成",
        id: "143",
        belong: "华渔华语水电费水电费水电费属地啊水电",
        content: "说明"
      },
      {
        id: "44",
        title: "书画世界",
        belong: "华渔",
        content: "说明"
      }
    ]
  },
  reducers: {
    render(state, { payload }) {
      Object.assign(state, payload);
      return { ...state };
    }
  },
  effects: {
    *getList({ payload }, { put }) {
      return Promise.resolve([]);
    }
  }
} as any;
