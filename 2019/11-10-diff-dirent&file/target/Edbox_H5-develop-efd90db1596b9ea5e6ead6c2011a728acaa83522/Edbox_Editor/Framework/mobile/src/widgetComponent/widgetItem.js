import React, { Component } from 'react'
import { Button, WhiteSpace } from 'antd-mobile'
import { connect } from 'dva'
import { getLocale } from 'umi-plugin-locale'
import { formatMessage } from 'umi/locale'
import WidgetComponent from './index'
import styles from './index.less'

@connect(({ edit }) => ({
  edit: edit
}))
class WidgetItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      locale: getLocale() === 'en-US' ? 'English' : 'Chinese',
      data: this.props.data
    }
  }

  renderWidgetComp = () => {
    const { data } = this.state
    if (data && WidgetComponent[data.Type]) {
      const WidgetComp = WidgetComponent[data.Type]
      return (
        <WidgetComp
          key={`widgetComp_${data.ID}`}
          config={data}
          onUpdate={this.handleUpdate}
        />
      )
    }
  }

  handleCancel = () => {
    this.props.onCancel()
  }

  handleOK = () => {
    // const { edit } = this.props
    // const { widgetData } = edit
    this.props.onOK(this.state.widgetData)
  }

  handleUpdate = (config) => {
    this.setState({
      widgetData: config
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: { ...nextProps.data }
    })
  }
  

  render() {
    const { data, locale } = this.state

    return (
      <div>
        <div className={styles['widget-popup-head']}>
          <Button
            className={styles['btn-cancel']}
            onClick={() => this.handleCancel()}>
            {formatMessage({ id: 'btn_cancel' })}
          </Button>
          <span className={styles['title']}>
            {data ? data[`${locale}Name`] : null}
          </span>
          <Button
            className={styles['btn-ok']}
            type="primary"
            onClick={() => this.handleOK()}>
            {formatMessage({ id: 'btn_ok' })}
          </Button>
        </div>
        <WhiteSpace />
        <div className={styles['widget-popup-content']}>
          {this.renderWidgetComp()}
        </div>
        {data && data.HintText ? (
          <div className={styles['widget-popup-tip']}>{data.HintText}</div>
        ) : null}
        {data && data.ErrorText ? (
          <div className={styles['widget-popup-error']}>{data.ErrorText}</div>
        ) : null}
      </div>
    )
  }
}

export default WidgetItem
