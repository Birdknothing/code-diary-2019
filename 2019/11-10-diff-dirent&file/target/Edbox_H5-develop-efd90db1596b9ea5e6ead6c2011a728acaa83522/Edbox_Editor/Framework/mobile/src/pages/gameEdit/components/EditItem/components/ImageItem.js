import React, { Component } from 'react';
import Iconfont from '@/components/Iconfont';
import styles from '../index.less';
import ActionSheetItem from '@/components/ActionSheet';
import {formatMessage} from 'umi/locale';
import {ActionSheet, Flex} from 'antd-mobile';
import router from 'umi/router';
import Swiper from 'swiper';
import 'swiper/dist/css/swiper.css';
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
      this.requestImage(this.props);
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.imageData !== this.props.imageData) {
        this.requestImage(nextProps);
      }
    }

    requestImage(nextProps) {
      const { imageData = {} } = nextProps;
      const { Datas = [] } = imageData;
      Datas.map((item) => {
        if (!item.Value && item.GUID) {
          Edbox.Resource.GetImage(
            item.GUID,
            url => {
              item.Value = url;
              this.setState({
                listData: Datas
              })
              Edbox.Message.Broadcast('Update', item);
            },
            err => {},
            null,
            true,
          );
        }
        return item;
      });
      this.setState({
        listData: Datas
      })
    }

    componentDidMount(prevProps, prevState) {
      new Swiper('#imageSwiper', {
        initialSlide: 0,
        slidesPerView: 5,
        spaceBetween: 5,
        scrollbar: {
            el: '.swiper-scrollbar',
            hide: false
        }
      });
    }
    componentWillUnmount() {
      this.setState = (state, callback) => {
        return;
      };
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
  handleImageSelect = (item) => {
    this.setState({
      activetData: item
    })
  }

  showActionSheet = () => {
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
      const { listData=[], activetData = {} } = this.state
      return (
        <div className={styles['page-wrap']}>
        <ActionSheetItem height={560}  className={styles['audio-action-sheet']} >
          <div id="imageSwiper" className="h-list swiper-container">
            <div className="swiper-wrapper">
                {listData.map((item, index) => (
                    <div className={`swiper-slide ${activetData.ID === item.ID ? 'active' : ''}`} key={item.ID} style={{backgroundImage: `url(${item.Value})`}} onClick={()=>this.handleImageSelect(item)}> </div>
                  ))
                }
            </div>
            <div className="swiper-scrollbar"></div>
          </div>
          <Flex 
            className={styles['btm-opr-wrap']} 
            onTouchMove={e => e.stopPropagation()}
            style = {{color: !activetData.ID ? '#ccc': 'inherit'}}
          >
            <FlexItem className={styles['opr-item']} >
                <Iconfont className={styles['icon']} type="icon-edit"  />
            </FlexItem>
            <FlexItem className={styles['opr-item']}>
                <Iconfont className={styles['icon']} type="icon-rotate1" />
            </FlexItem>
            <FlexItem className={styles['opr-item']} onClick={ ()=> this.showActionSheet()}>
              <Iconfont className={styles['icon']} type="icon-rotate" />
            </FlexItem>
          </Flex>
          </ActionSheetItem>
        </div>
      );
  }
}

export default EditAudio;
