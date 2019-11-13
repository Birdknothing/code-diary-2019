import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal} from 'antd';
import styles from './index.scss';
import { formatMessage } from 'umi/locale'

/*进度组件(根据iframe通信)
  visible:false,  //可见性,必传
  nowProgress: 10%, // 必传，百分数
  onFinish: function, // 选传，100%之后的时间回调
 */
@connect()
class ProgressLoadingModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
  }

  componentWillMount(){
    clearTimeout(this.closeTimerId);
  }

  componentWillReceiveProps(nextProps){
    if(parseInt(nextProps.nowProgress)>=100) {
       if(nextProps.onFinish){
        nextProps.onFinish();
       }
    }
  }
  modalCancel = () => {
    const { modalCancel } = this.props;
    // 优化关闭有动画
    this.setState(
      {
        visible: false,
      },
      () => {
        this.closeTimerId = setTimeout(() => {
          if (modalCancel) {
            modalCancel();
          }
        }, 500);
      },
    );
  };

  render() {
    const { visible } = this.state;
    const {
      nowProgress,
      type,
    } = this.props;

    return (
      <Modal
        title=""
        centered
        width={358}
        visible={visible}
        maskStyle={{opacity:'0'}}
        className={styles['progress-modal']}
        footer={null}
        closable={false}
      >
      <p className={styles['txt']}>{nowProgress}</p>
      <div className={styles['progress-wrap']}>
        <div className={styles['now-progress']} style={{width:`${nowProgress}`}}></div>
      </div>
      <p className={styles['tip']}>{type==='editor'?formatMessage({id:'mw_modal_tip_edit'}):formatMessage({id:'mw_modal_tip_game'})}</p>

      </Modal>
    );
  }
}

export default ProgressLoadingModal;
