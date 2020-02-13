const items = [];
const InfiniteScroll = require("./target.js");
const React = require("react");
const ReactDOM = require("reactDom");
const loadFunc = () => {
  const ele = <li>1</li>;
  items.push(ele);
};
const M = props => (
  <InfiniteScroll
    pageStart={0}
    loadMore={loadFunc}
    hasMore={true || false}
    loader={
      <div className="loader" key={0}>
        Loading ...
      </div>
    }
  >
    <ul>{items}</ul>
  </InfiniteScroll>
);
ReactDOM.render(<M />, app);
