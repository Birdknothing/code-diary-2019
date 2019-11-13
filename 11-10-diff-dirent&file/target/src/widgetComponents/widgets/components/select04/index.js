import React, { PureComponent } from 'react';
import { Checkbox, Icon } from 'antd';
import styles from './index.scss';

import arrayMove from 'array-move';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

const defaultBg =
  'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==';

class Select04 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      config: this.props.config,
      controls: this.props.controls,
      orderItems: [], // 全部排序数据
    };
  }

  componentDidMount() {
    const {
      config: { Key, Keys, Items_Override },
    } = this.state;
    let {
      config: { Items = [] },
    } = this.state;

    Items = Items_Override || Items;

    // config.Value最终值要以Key为准，故要重新赋值
    this.setState(prevState => ({
      orderItems: this.mapOrderArrByOrderKeys(Keys, Items),
      config: {
        ...prevState.config,
        Value: this.mapOrderArrByOrderKeys(Key, Items),
      },
    }));
  }

  componentWillReceiveProps(nextProps) {
    const {
      config: { Key, Keys, Items_Override },
    } = nextProps;
    let {
      config: { Items = [] },
    } = nextProps;

    Items = Items_Override || Items;

    // config.Value最终值要以Key为准，故要重新赋值
    this.setState({
      config: { ...nextProps.config, Value: this.mapOrderArrByOrderKeys(Key, Items) },
      controls: { ...nextProps.controls },
      orderItems: this.mapOrderArrByOrderKeys(Keys, Items),
    });
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  /**
   * @desc 根据排序的keys映射排序的列表数组
   * @param {Array} keys：排序的keys(和原数据中Name对应)
   * @param {Array} items：原始数据
   * @return {Array} orderItems： 排序数组
   */
  mapOrderArrByOrderKeys = (keys, items) => {
    const orderItems = [];

    for (let i = 0, n = keys.length; i < n; i++) {
      const keyName = keys[i];
      for (let j = 0, m = items.length; j < m; j++) {
        const obj = items[j];
        if (obj.Name === keyName) {
          orderItems.push(obj);
        }
      }
    }

    return orderItems;
  };

  /**
   * @desc 从数组里映射Keys
   * @param {Array} orderItems：排序的数据
   * @return {Array} orderKeys： 排序Keys数组(和Name对应)
   */
  mapOrderKeysInArr = orderItems => {
    const orderKeys = orderItems.map(item => {
      item = item.Name;
      return item;
    });

    return orderKeys;
  };

  /**
   * @desc checkbox改变
   * @param {Object} e：事件对象
   * @param {Number} index：索引值
   */
  handleCheckboxChange = (e, index) => {
    const {
      config: { Value },
      orderItems,
    } = this.state;

    let newItems = [...orderItems];
    newItems = this.addSignInOriginArr(Value, newItems);
    let newValue = [];
    const isChecked = e.target.checked;

    newItems[index].isChecked = isChecked;
    newValue = this.makeTargetArrBySign(newItems);

    this.setState(
      prevState => ({
        config: {
          ...prevState.config,
          Value: newValue,
          Key: this.mapOrderKeysInArr(newValue),
        },
      }),
      () => {
        // console.log('当前的config：', this.state.config);
        this.props.onUpdate(this.state.config);
      },
    );
  };

  /**
   * @desc 给源数组的每项添加是否选中标志isChecked=true
   * @param {Array} targetArr: 目标数组，即选中数组
   * @param {Array} originArr: 源数组
   * @return  {Array} 源数组
   */
  addSignInOriginArr = (targetArr, originArr) => {
    const hasIndexArr = [];

    for (let i = 0; i < targetArr.length; i++) {
      const targetItem = targetArr[i];
      for (let j = 0, m = originArr.length; j < m; j++) {
        const originItem = originArr[j];
        if (targetItem.Name === originItem.Name) {
          hasIndexArr.push(j);
          break;
        }
      }
    }

    originArr = originArr.map((item, index) => {
      hasIndexArr.indexOf(index) > -1 ? (item.isChecked = true) : (item.isChecked = false);
      return item;
    });

    return originArr;
  };

  /**
   * @desc 在源数组中根据标志返回选中数组
   * @param {Array} originArr: 源数组
   * @return  {Array} 选中数组
   */
  makeTargetArrBySign = originArr => {
    const targetArr = [];

    for (let i = 0, n = originArr.length; i < n; i++) {
      const originItem = originArr[i];
      if (originItem.isChecked) {
        delete originItem.isChecked;
        targetArr.push(originItem);
      } else {
        delete originItem.isChecked;
      }
    }

    return targetArr;
  };

  /**
   * @desc 判断当前对象是否存在选中数组中
   * @param {Object} nowItem： 当前对象
   * @param {Array} selectedArr： 选中数组
   */
  adjustIsChecked = (nowItem, selectedArr) => {
    const isChecked = selectedArr.some(item => {
      return nowItem.Name === item.Name;
    });
    return isChecked;
  };

  /**
   * @desc 拖拽排序结束
   */
  handleSortEnd = ({ oldIndex, newIndex }) => {
    const {
      orderItems,
      config: { Value },
    } = this.state;
    let newItems = arrayMove(orderItems, oldIndex, newIndex);

    newItems = this.addSignInOriginArr(Value, newItems);
    const newValue = this.makeTargetArrBySign(newItems);

    this.setState(
      prevState => ({
        config: {
          ...prevState.config,
          Keys: this.mapOrderKeysInArr(newItems),
          Value: newValue,
          Key: this.mapOrderKeysInArr(newValue),
        },
        orderItems: newItems,
      }),
      () => {
        // console.log('转移之后：', this.state.orderItems);
        this.props.onUpdate(this.state.config);
      },
    );
  };

  render() {
    let {
      config: { Value, ReadOnly = false, ErrorText = '', ErrorText_Override },
      orderItems,
    } = this.state;

    ErrorText = ErrorText_Override || ErrorText;

    // 拖拽项
    const SortableItem = SortableElement(({ value: { item, index } }) => (
      <div className={styles['item-wrap']} key={index}>
        <div className={styles['item']}>
          <Checkbox
            onChange={e => {
              this.handleCheckboxChange(e, index);
            }}
            checked={this.adjustIsChecked(item, Value)}
            disabled={Value.length === 1 && Value[0].Name === item.Name}
          ></Checkbox>
          <div className={styles['ico-logo-wrap']}>
            {item.Image ? (
              <img
                className={styles['ico-logo']}
                src={item.Image}
                alt=""
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = defaultBg;
                }}
              />
            ) : item.ImageGUID ? (
              <Icon className={styles['loading']} type="loading" />
            ) : null}
          </div>
          <span className={styles['tit']}>{item.ShowName}</span>
          <span className={styles['ico-drag']}></span>
        </div>
      </div>
    ));

    // 拖拽容器
    const SortableList = SortableContainer(({ items }) => {
      return (
        <div className={styles['list']}>
          {items.map((item, i) => (
            <SortableItem key={`item-${i}`} index={i} value={{ item, index: i }} />
          ))}
        </div>
      );
    });

    return (
      <div>
        <div className={styles['viewer']}>
          <SortableList
            items={orderItems}
            onSortEnd={this.handleSortEnd}
            helperClass={styles['sortableHelper']}
          />
          {/* 只读 */}
          {ReadOnly ? <div className={styles['disable-mask']}></div> : null}
        </div>
        {ErrorText ? <p className={styles['widget-item-error']}>{ErrorText}</p> : null}
      </div>
    );
  }
}

export default Select04;
