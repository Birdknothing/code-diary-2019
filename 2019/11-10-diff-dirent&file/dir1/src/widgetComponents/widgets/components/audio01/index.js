import React, { PureComponent } from 'react';
import { Button, Popover,message } from 'antd';
import { formatMessage } from 'umi/locale';
import common from '../../../common.scss';
import styles from './index.scss';
import icoSound from '@/assets/audio_play.png';

const {Edbox} = window;
class Audio01 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      config: this.props.config,
      controls: this.props.controls,
    };
  }

  handleEdit = () => {
    const { config } = this.state;
    this.props.onArouse(config);
    this.audio.pause();
    this.togglePlayState('pause');
    clearInterval(this.timer);
    this.pauseAudios('all');
  };

  /**
   * 处理音频的暂停和播放
   */
  handleListen = () => {
    const {config:{GUID,ResourceName,Value}} = this.state;
    let canListen = false;

    if(GUID){
      if(ResourceName === undefined||ResourceName===''){
        canListen= false;
      }else{
        canListen= false;
        // 自由剪裁时候存在Value为空，需要特殊处理：再次请求资源
        if(Value === ''){
          Edbox.NDR.Get(
            GUID,
            data => {
              if(data){
                this.setState(prevState=>({
                  config:{
                    ...prevState.config,
                    Value:data.Url
                  },
                }),()=>{
                  canListen= true;
                  this.listenSwitch(canListen);
                });
              }
            },
            err => {
              canListen= false;
              message.info(formatMessage({id:'no_resource'}));
              this.listenSwitch(canListen);
            },
            null,
            true,
          );
        }else{
          canListen= true;
        }

      }
    }else{
      canListen= false;
    }
    this.listenSwitch(canListen);

  };


  listenSwitch=(canListen)=>{
    if(canListen){
      this.pauseAudios();
      if (this.audio.paused) {
        this.audio.currentTime = 0;
        this.audio.play();
        this.togglePlayState('play');
        this.checkEnded();

        // 广播消息，关闭其他音频
        Edbox.Message.Broadcast("StopAudio",[]);

      } else {
        this.audio.pause();
        this.togglePlayState('pause');
        clearInterval(this.timer);
      }
    }

  }

  componentWillReceiveProps(nextProps) {
    // 编辑音频控件不选名称时，从“我的游戏”进来后会变成 undefined。
    const {
      config: { ResourceName,Type },
    } = nextProps;
    if (ResourceName === undefined) {
      nextProps.config.ResourceName = '';
    }

    this.setState({
      config: { ...nextProps.config },
      controls: { ...nextProps.controls },
    });
    if(this.icoPlay&&Type==="Audio01"){
      this.icoPlay.classList.remove('playing');
    }
  }

  checkEnded() {
    this.timer = null;
    if (!this.audio) {
      return false;
    }
    this.timer = setInterval(() => {
      if (this.audio && this.audio.ended) {
        this.togglePlayState('pause');
        clearInterval(this.timer);
      }
    }, 1000);
  }

  togglePlayState(flag) {
    switch (flag) {
      case 'play':
        this.icoPlay.classList.add('playing');
        break;

      case 'pause':
        clearInterval(this.timer);
        this.icoPlay.classList.remove('playing');
        break;
      default:
        break;
    }
  }

  pauseAudios(flag) {
    const oAudios = document.querySelectorAll(`.${styles['real-audio']}`);
    for (let i = 0; i < oAudios.length; i++) {
      const oAudio = oAudios[i];
      if (flag !== 'all' && oAudio.getAttribute('data-id') === this.audio.getAttribute('data-id')) {
        continue;
      }
      oAudio.pause();
      oAudio.parentNode
        .querySelector(`.${styles['ico-sound']}`)
        .classList.remove('playing');
    }
  }

  render() {
    const {
      config: { ID, ResourceName, Value = '', ReadOnly = false, ErrorText_Override, GUID, },
      controls,
    } = this.state;

    let {config: { ErrorText = ''}} = this.state;

    let nameStr = formatMessage({ id: 'loading' });
    if(GUID){
      if(ResourceName === undefined){
        nameStr = formatMessage({ id: 'loading' });
      }else if(ResourceName===''){
        nameStr=formatMessage({ id: 'empty_audio' });
      }else{
        nameStr= ResourceName;
      }
    }else{
      nameStr = formatMessage({ id: 'empty_audio' });
    }

    ErrorText = ErrorText_Override||ErrorText;

    return (
      <div>
        <div className={styles['audio'] + ' ' + common['ellipsis']}>
          <i
            className={`${styles['ico-sound']} ico-sound`}
            style={{ backgroundImage: `url("${icoSound}")` }}
            onClick={this.handleListen.bind(this)}
            ref={icoPlay => (this.icoPlay = icoPlay)}
          />
          <span className={styles['name']}>
            {nameStr}
          </span>
           {/*
            <span className={styles['name']}>
              {ResourceName === undefined
                ? formatMessage({ id: 'loading' })
                : ResourceName
                ? ResourceName
                : formatMessage({ id: 'empty_audio' })}
            </span>
           */}
          {ReadOnly ? null : (
            <Popover placement="bottom" content={formatMessage({ id: 'audio_edit_tip' })}>
              <Button
                className={
                  controls && controls.ID === ID
                    ? `${styles['btn-edit']} ${styles['active']}`
                    : styles['btn-edit']
                }
                shape="circle"
                // disabled={ReadOnly}
                onClick={() => this.handleEdit()}
              >
                <span className={styles.editIcon} />
              </Button>
            </Popover>
          )}
          <audio
            src={Value}
            className={`${styles['real-audio']} real-audio`}
            ref={audio => (this.audio = audio)}
            data-id={ID}
          />
        </div>
        {ErrorText ? <p className={styles['widget-item-error']}>{ErrorText}</p> : null}
      </div>
    );
  }
}

export default Audio01;
