import React, { Component } from 'react';
import styles from './index.scss';

/*
 * 搜索框组件
 * @param {String} placeholder：搜索框的placeholder，选填，默认为空
 * @param {String} defaultValue：搜索初始默认值，选填，默认为空
 * @param {Function} onSearch：搜索事件，会传一个当前value出去，选填
 * @param {Function} onFocus：聚焦事件，会传一个当前value出去，选填
 * @param {Function} onChange：改变事件，会传一个当前value出去，选填
 */
class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue ? props.defaultValue : '',
      isFocus: false
    };
  }

  // 修改默认值
  componentWillReceiveProps = nextProps => {
    if (
      typeof this.props.defaultValue !== 'undefined' &&
      nextProps.defaultValue !== this.props.defaultValue
    ) {
      this.setState({
        value: nextProps.defaultValue,
        isFocus: false
      });
    }
    const { value } = this.state;
    if (value) {
      const icoEl = document.getElementById('ico');
      icoEl.classList.add(styles['on']);
    }
  };

  handleChangeValue = e => {
    const { value } = e.target;
    const { onChange } = this.props;
    this.setState({
      value
    });
    if (onChange) {
      onChange(value);
    }
    console.log('555');
  };

  // 回车触发搜索
  handleEnterSearch = e => {
    e.preventDefault();
    if (e.keyCode === 13) {
      this.handleSearch();
    }
  };

  // 搜索事件
  handleSearch = () => {
    const { onSearch } = this.props;
    const { value } = this.state;
    onSearch(value);
    this.inputEl && this.inputEl.blur();
  };

  // 提交事件
  handleSubmit = e => {
    e.preventDefault();
    return false;
  };

  // 聚焦添加样式
  handleFocus = () => {
    const { onFocus } = this.props;
    const icoEl = document.getElementById('ico');

    icoEl.classList.add(styles['on']);
    if (onFocus) {
      onFocus();
    }
    this.setState({
      isFocus: true
    });
  };

  // 失焦移除样式
  handleBlur = () => {
    const { value } = this.state;
    const icoEl = document.getElementById('ico');
    if (!value) {
      icoEl.classList.remove(styles['on']);
    }
  };

  // 清空值
  clearValue = () => {
    const { onChange } = this.props;
    this.setState({
      value: ''
    });
    this.inputEl && this.inputEl.focus();
    if (onChange) {
      onChange('');
    }
  };

  render() {
    const { placeholder = '' } = this.props;
    const { value } = this.state;

    return (
      <div className={styles['search-wrap']}>
        <form
          action=""
          className={styles['form']}
          onSubmit={e => {
            this.handleSubmit(e);
          }}
        >
          <input
            ref={el => (this.inputEl = el)}
            value={value}
            className={styles['input']}
            type="search"
            placeholder={placeholder}
            onChange={e => this.handleChangeValue(e)}
            onKeyUp={e => this.handleEnterSearch(e)}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        </form>
        <span className={`${styles['ico']}`} onClick={this.handleSearch} id="ico"></span>
        {value ? <span className={styles['btn-clear']} onClick={this.clearValue}></span> : null}
      </div>
    );
  }
}

export default SearchBar;
