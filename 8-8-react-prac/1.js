const str = `<div id="app"></div>
<script type="text/babel">
  const { Component, Fragment } = React;
  class C extends Component {
    state = { x:1 }
    render() {
      return ( <div>{this.state.x}</div> );
    }
  }
  ReactDOM.render(,app)
</script>`;
console.log(String.fromCharCode(32));
console.log(str.charCodeAt(49));
console.log(
  str
    .replace(/\n/g, '\\n')
    .replace(/\t/, '\\t')
    .replace(/\r/, '\\r')
    .replace(/"/g, '\\"')
);
const a = [1, 2];
// const b = a.splice(2, 0, ...[3, 4]);
const b = a.concat([3, 4]);
console.log(a);
console.log(b);
console.log(a === b);
