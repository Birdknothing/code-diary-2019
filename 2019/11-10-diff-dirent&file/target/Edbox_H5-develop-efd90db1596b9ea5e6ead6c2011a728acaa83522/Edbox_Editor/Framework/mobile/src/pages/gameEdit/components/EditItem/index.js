import React, { Component } from 'react'
import { connect } from 'dva'
import { List } from 'antd-mobile'
import { formatMessage } from 'umi/locale'
import WidgetItem from 'widget/WidgetItem'
import TypeItem from './TypeItem'
import styles from './index.less'
import OverflowScrolling from 'react-overflow-scrolling'


const ListItem = List.Item
const Brief = ListItem.Brief


@connect(({ edit, global }) => ({
  edit: edit,
  text: global.text
}))
class EditItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      widgetData: undefined,
      isShowWidget: false,
    }
  }

  renderTabList = (data) => {
    const tabList = []
    const { Datas = [] } = data

    Datas.map((item) => {
      if (item.Type === 'Tab02') {
        return tabList.push({
          title: 'ShowName'
        })
      }
      return null;
    })

    return tabList
  }

  renderContent = (data) => {
    const { Datas = [] } = data;    
    return Datas.map((item) => {
      if( item.Type.indexOf('Tab0') > -1 ) {
        return (
          <div key={item.ID} className={styles['widget-page-content']}>
            {this.renderTabContent(item)}
          </div>
        )
      } else {
        return this.renderWidget(item)
      }
      // return (
      //   <div key={item.ID} className={styles['widget-page-content']}>
      //     {this.renderTabContent(item)}
      //   </div>
      // )
    })
  }

  renderTabContent = (data) => {
    const { Datas = [] } = data;
    return Datas.map((item) => {
      return this.renderWidget(item)
    })
  }

  renderWidget = (data) => {
    const hasChild = data.Type === 'Tab03'
    if (hasChild) {
      const { Datas = [] } = data
      return (
        <List
          key={`list_${data.ID}`}
          renderHeader={() => data['ShowName']}>
          {Datas.map((item) => {
            return this.renderListItem(item)
          })}
        </List>
      )
    } else {
      return <List key={`list_${data.ID}`}>{this.renderListItem(data)}</List>
    }
  }

  renderListItem = (data) => {
    const { ID, Type, ReadOnly, ShowName } = data
    return (
      <ListItem
        key={`list_item_${ID}`}
        extra={this.renderExtra(data)}
        arrow={ReadOnly ? 'empty' : 'horizontal'}
        onClick={() => this.handleClickItem(data)}>
        {ShowName}
        {Type === 'Image01' ? (
          <Brief>{`${formatMessage({ id: 'suggest_ratio' })} ${data.Width} : ${
            data.Height
          }`}</Brief>
        ) : null}
      </ListItem>
    )
  }

  renderExtra = (data) => {
    const { ReadOnly } = data
    return (
      <div
        className={
          ReadOnly ? `${styles['box']} ${styles['disabled']}` : styles['box']
        }>
        {this.renderWidgetValue(data)}
      </div>
    )
  }

  renderWidgetValue = (data) => {
    const { Type } = data
    if (Type === 'Image01') {
      const { Edbox } = window
      let realSrc
      if (!data.Value && data.GUID) {
        Edbox.Resource.GetImage(
          data.GUID,
          (url) => {
            realSrc = url
          },
          (err) => {
            console.log(err)
          }
        )
      } else {
        realSrc = data.Value
      }
      return <img src={realSrc} alt="" />
    } else if (Type === 'Select03') {
      return <span>{data.Value.join(',')}</span>
    } else if (Type === 'Value02') {
      return (
        <span>
          {data.Value} {data.UnitText}
        </span>
      )
    } else if (Type === 'Value03') {
      return (
        <span>
          {data.Value[0]}
          {data.ToText}
          {data.Value[1]} {data.UnitText}
        </span>
      )
    } else if (Type === 'Switch01') {
      return <span>{data.Value.toString()}</span>
    } else {
      return <span>{data.Value}</span>
    }
  }

  handleClickItem = (data) => {
    const { Type, ReadOnly } = data
    if (ReadOnly || Type === 'Image01') {
      return false
    }

    this.setState({
      widgetData: data,
      isShowWidget: true
    })
  }

  handleCancel = () => {
    // const { dispatch } = this.props

    this.setState({
      widgetData: undefined,
      isShowWidget: false
    })

    // dispatch({
    //   type: 'edit/setWidgetData',
    //   payload: {
    //     widgetData: undefined
    //   }
    // })
  }

  deptMap = (arr, fn, result) => {
    arr.forEach(item => {
      if (item.Datas && item.Datas.length) {
        this.deptMap(item.Datas, fn, result)
      } else {
        if (fn(item)) {
          item = Object.assign(item, result)
        }
      }
    })
  }

  handleOK = (widgetData) => {
    const { dispatch } = this.props
    // 数据更新到全局
    let OriginCurrentData = this.props.edit.currentData
    let OriginDataSource = this.props.edit.dataSource
    if(widgetData){
      this.deptMap(OriginCurrentData.Datas, item => { //存储currentData
        return item.ID === widgetData.ID
      }, widgetData)
      this.deptMap(OriginDataSource.Datas, item => { //存储dataSource
        return item.ID === widgetData.ID
      }, widgetData)

      window.Edbox.Message.Broadcast('Update', [widgetData]);

      if(OriginCurrentData.Recommend){
        let recommend = this.props.edit.recommendList || []
        recommend.push(OriginCurrentData.ID)
        let newRecommend = new Set(recommend)
        dispatch({
          type: 'edit/setRecommendList',
          payload: {
            recommendList: [...newRecommend]
          }
        })
      }
      dispatch({
        type: 'edit/setCDData',
        payload: {
          currentData: OriginCurrentData,
          dataSource: OriginDataSource
        }
      })
    }
    this.setState({
      widgetData: undefined,
      isShowWidget: false
    })
  }

  render() {
    const { widgetData, isShowWidget } = this.state
    const { edit } = this.props
    const { currentData = {}, urlIframe } = edit
    const { PageType = 'FullPage' } = currentData
    return (
      <div className={styles.editItem}>
        <OverflowScrolling  
          className={styles.gameItem}
          style={PageType === 'Default' ? null : { display: 'none' }}
          onTouchMove={e => e.stopPropagation()}
        >
        <div  className={styles.scrollItem} >
          <iframe
            src={urlIframe}
            frameBorder="0"
            title="game"
            width="100%"
            height="75%"
            className={styles.iframe}
            id="GameFrame"
          />
          </div>
        </OverflowScrolling>
        {PageType === 'Default' ?
        <TypeItem />
        : <div>
          <div className={styles['widget-page']}>
            {this.renderContent(currentData)}
          </div>
          <div
            className={
              isShowWidget
                ? `${styles['widget-popup']} ${styles['show']}`
                : `${styles['widget-popup']} `
            }>
            <WidgetItem
              key="WidgetItem"
              data={widgetData}
              onCancel={this.handleCancel}
              onOK={this.handleOK}
            />
          </div>
        </div>
        }
      </div>
    )
  }
}

export default EditItem
