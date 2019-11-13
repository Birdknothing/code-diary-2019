import React, { Component } from 'react';
import Iconfont from '@/components/Iconfont';
import styles from '../index.less';
import ActionSheetItem from '@/components/ActionSheet';
import {formatMessage} from 'umi/locale';
import {ActionSheet, Flex} from 'antd-mobile';
import router from 'umi/router';
const { Edbox } = window;
const FlexItem = Flex.Item;

class EditAudio extends Component {
    constructor(props) {
        super(props);
        this.state = {
          listData: undefined,
          activetData: undefined
        };
    }

    componentWillMount() {
      this.requestAudio(this.props);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.audioData !== this.props.audioData) {
        this.requestAudio(nextProps);
      }
    }

    componentWillUnmount() {
      // console.log(1312312);
      this.setState = (state, callback) => {
        return;
      };
    }

    requestAudio(nextProps) {
      const { audioData = {} } = nextProps;
      const { Datas = [] } = audioData;
      const listData = Datas.map((item) => {
        if (!item.Value && item.GUID) {
          Edbox.Resource.GetAudio(
            item.GUID,
            url => {
              item.Value = url;
              this.setState({
                listData: listData
              })
              item.Message.Broadcast('Update', item);
            },
            err => {},
            ['mp3'],
            true,
          );
        }
        return item;
      });

      this.setState({
        listData: listData
      })
    }

    startAudio = (item) => {
      const { activetData = {} } = this.state
      if(activetData === item && item.Play  ) {
        item.Play = false
      }else {
        item.Play = true
      }
      this.setState({
        activetData: item
      })
    }
    
    showActionSheet() {
      const {  activetData = {} } = this.state
      if(!activetData.ID) {
        return
      }
      const opts = [formatMessage({id: 'no_picture'}), formatMessage({id: 'online_picture'}), formatMessage({id: 'local_picture'}), formatMessage({id: 'text_picture'}), formatMessage({id: 'cancel'})];
      ActionSheet.showActionSheetWithOptions({
          options: opts,
          cancelButtonIndex: opts.length - 1,
          destructiveButtonIndex: opts.length - 1,
          title: formatMessage({id: 'restore_to_default_piture'}),
      },
      (index) => {
        switch(index) {
          case 1:
            router.push('/Edbox_ImageSelector/OnlineImage');
            break;
          case 3: 
            router.push('/Edbox_ImageSelector/TextImage');
            break;
          default:
            break;
        }
      })
    }

    render() {
        // const { audioData = {} } = this.props;
        // const { Datas = [] } = audioData;
        const { listData = [], activetData = {} } = this.state
        return (
          <div className={styles['page-wrap']}>
          <ActionSheetItem className={styles['audio-action-sheet']} height={560}>
            <div className={styles['top-list-wrap']} onTouchMove={e => e.stopPropagation()}>
              <ul className={styles['top-list']}>
                  {listData.map((item, index)=>(
                    <li className={styles['card-item']} key={index.toString()} onTouchStart={e => this.startAudio(item)}>
                      <div 
                        className={`${styles['item']} ${activetData.ID === item.ID ? item.Play ? styles['play']: styles['stop'] :''}`} 
                        key={item.ID}
                      >
                        <span className={styles['sup']}>{item.AudioType}</span>
                        <p className={styles['tit']}>{item.ShowName}</p>
                        <span  className={styles['ico']}>
                        <Iconfont className={styles['icon']} type="icon-pause" />
                        </span>
                        {(activetData.ID === item.ID && item.Play)
                          ? <audio id="mainBgAudio" autoPlay={true} src={item.Value}></audio>
                          :null
                        }
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
            <Flex 
              className={styles['btm-opr-wrap']} 
              onTouchMove={e => e.stopPropagation()}
              style = {{color: !activetData.ID ? '#ccc': 'inherit'}}
            >
                <FlexItem className={styles['opr-item']} onClick={ ()=> this.showActionSheet()}>
                    <Iconfont className={styles['icon']} type="icon-rotate"  />
                </FlexItem>
                <FlexItem className={styles['opr-item']}>
                    <Iconfont className={styles['icon']} type="icon-cut" />
                </FlexItem>
            </Flex>
            </ActionSheetItem>
          </div>
        );
    }
}

export default EditAudio;
