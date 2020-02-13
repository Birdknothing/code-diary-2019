const REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;

class Bold extends React.Component {
  render() {
    return <span style={{fontWeight: 'bold'}}>{this.props.text}</span>
  }
}

class Italic extends React.Component {
  render() {
    return <span style={{fontStyle: 'italic'}}>{this.props.text}</span>
  }
}

class Main extends React.Component {
  
  state = {
    source: `{
  $$typeof: REACT_ELEMENT_TYPE,
  type: 'div',
  props: {
    children: [
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: Bold,
        props: { text: 'bold' },
        key: null,
        ref: null
      },
      ' and ',
      {
        $$typeof: REACT_ELEMENT_TYPE,
        type: Italic,
        props: { text: 'italic' },
        key: null,
        ref: null
      }
    ]
  },
  key: null,
  ref: null
}`
  }
  
  change = (event) => {
    this.setState({source: event.target.value})
  }
  
  compile = () => {
    var inlineComponent = new Function(
      'REACT_ELEMENT_TYPE', 'Bold', 'Italic',
      `return ${this.state.source}`)(REACT_ELEMENT_TYPE, Bold, Italic)
    ReactDOM.render(inlineComponent, document.querySelector('#compiled'))
  }
  
  render() {
    return <div>
      <textarea className="form-control" rows="20" value={this.state.source} onChange={this.change}/>
      <button className="btn btn-primary btn-block" onClick={this.compile}>Compile</button>
    </div>
  }
}


ReactDOM.render(<Main/>,
                document.querySelector('#main'))