import React from "react";
import logo from "./logo.svg";
import "./App.css";

import data from "./model";

function App(props) {
    console.log("app render");
    const { datas, setState, title, setTitle } = props;
    const mkRender = f => (...args) => f(...args) && setState({});
    let addItem = name => datas.push({ name });
    let rmItem = index => datas.splice(index, 1);
    let cgTitle = val => setTitle(val);

    addItem = mkRender(addItem);
    rmItem = mkRender(rmItem);
    cgTitle = mkRender(cgTitle);
    return (
        <div className="App">
            <img src={logo} style={{ width: 100, height: 100 }} />
            <h3>{title}</h3>
            <div className="changeTitle">
                <input
                    type="text"
                    onKeyDown={e =>
                        e.keyCode === 13 && cgTitle(e.currentTarget.value)
                    }
                />
                <span className="change">修改</span>
            </div>
            <div className="addBox">
                <input
                    type="text"
                    onKeyDown={e =>
                        e.keyCode === 13 && addItem(e.currentTarget.value)
                    }
                />
                <span
                    className="add"
                    onClick={e =>
                        addItem(e.currentTarget.previousElementSibling.value)
                    }
                >
                    新增
                </span>
            </div>
            <ul className="items">
                {datas.map((ele, i) => (
                    <li key={i} className="item">
                        <span className="txt">{ele.name}</span>
                        <button className="del" onClick={e => rmItem(i)}>
                            删除
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const injectData = data => props => <App {...props} {...data} />;

export default injectData(data);
