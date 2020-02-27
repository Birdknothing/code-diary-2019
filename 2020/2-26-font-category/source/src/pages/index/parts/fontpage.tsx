import React, { Component, Fragment } from "react";
import styles from "./index.scss";
import { IconCreate, Earth, Star, Play } from "@/components/IconFont";
import SearchBar from "@/components/SearchBar/index.tsx";
import { connect } from "dva";
import river from "@/assets/river.jpg";
import exp from "@/assets/ancient.jpg";
@connect(({ list }) => ({ list }))
class Main extends Component {
  props: any;
  state = {
    firtSortArr: [
      { title: "综合", tag: "general" },
      { title: "最新发布", tag: "latest" },
      { title: "最多点击", tag: "clickMost" },
      { title: "最多下载", tag: "downloadMost" }
    ]
  };
  clickBtn(type) {
    const { list, dispatch } = this.props;
    let index = 0;
    switch (type) {
      case "onlineWork":
        index = 1;
        break;

      default:
        break;
    }
    dispatch({
      type: "list/render",
      payload: {
        listTypeIndex: index
      }
    });
  }
  choseTag(e) {
    const inputDom = e.currentTarget.previousElementSibling;
    inputDom["checked"] = true;
  }
  render() {
    const { list } = this.props;
    const { firtSortArr } = this.state;
    const { name, listTypeArr, listTypeIndex, tagTypeArr } = list;
    const { title: listName, prop } = listTypeArr[listTypeIndex];
    const dataArr = list[prop];
    console.log(dataArr.length);

    console.log("fontpage render");
    return (
      <Fragment>
        <aside className={styles["sideBar"]}>
          <div className={styles["icon"]}>
            <Earth />
          </div>
          <div className={styles["name"]}>{name}</div>
          <div className={styles["create"]}>
            <IconCreate />
            <span className={styles["font1"]}>我的创作</span>
          </div>
          <div className={styles["myWork"]}>
            <IconCreate />
            <span
              className={styles["font1"]}
              onClick={e => {
                this.clickBtn("myWork");
              }}
            >
              我的作品
            </span>
          </div>
          <div className={styles["onlineWork"]}>
            <IconCreate />
            <span
              className={styles["font1"]}
              onClick={e => {
                this.clickBtn("onlineWork");
              }}
            >
              在线作品
            </span>
          </div>
        </aside>
        <section className={styles["main"]}>
          <header className={styles["scrollPic"]}>
            <div className={styles["title"]}>推荐</div>
            <div className={styles["scroll"]}>
              <img src={river} alt="" />
            </div>
          </header>
          <section className={styles["listArea"]}>
            <div className={styles["titleMain"]}>{listName}</div>
            <div className={styles["listHead"]}>
              <div className={styles["tagArea"]}>
                <p>
                  排序 :
                  {firtSortArr.map(({ title, tag }, i) => (
                    <Fragment>
                      <input
                        type="radio"
                        name="sort1"
                        className={styles["ctrlTag"]}
                        checked={i == 0}
                      />
                      <span
                        className={styles["tagLine"]}
                        key={tag}
                        onClick={this.choseTag.bind(this)}
                      >
                        &nbsp;&nbsp;{title}&nbsp;&nbsp;|
                      </span>
                    </Fragment>
                  ))}
                </p>
                <p>
                  分类 :
                  {tagTypeArr.map(({ title, tag }, i) => (
                    <Fragment>
                      <input
                        type="radio"
                        name="sort2"
                        className={styles["ctrlTag"]}
                        checked={i == 0}
                      />
                      <span
                        className={styles["tagLine"]}
                        key={tag}
                        onClick={this.choseTag.bind(this)}
                      >
                        &nbsp;&nbsp;{title}&nbsp;&nbsp;|
                      </span>
                    </Fragment>
                  ))}
                </p>
              </div>
              <div className={styles["searchBox"]}>
                <SearchBar />
              </div>
            </div>
            <div className={styles["listBody"]}>
              <div className={styles["list"]}>
                {dataArr.map(({ id, title, belong, content }) => {
                  return (
                    <div className={styles["listBoxContainer"]} key={id}>
                      <div className={styles["listBox"]}>
                        <div className={styles["picBox"]}>
                          <div className={styles["videoCut"]}>
                            <img src={exp} alt="" />
                          </div>
                          <div className={styles["modal"]}>
                            <div className={styles["icon"]}>
                              <Play />
                            </div>
                          </div>
                        </div>
                        <div className={styles["slide"]}>
                          <div className={styles["info"]}>
                            <h4 className={styles["title"]}>{title}</h4>
                            <pre className={styles["content"]}>{content}</pre>
                          </div>
                        </div>
                        <div className={styles["belong"]}>
                          <div className={styles["icon"]}>
                            <Star />
                          </div>
                          <div className={styles["to"]}>
                            <span>{belong}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </section>
      </Fragment>
    );
  }
}
export default Main;
