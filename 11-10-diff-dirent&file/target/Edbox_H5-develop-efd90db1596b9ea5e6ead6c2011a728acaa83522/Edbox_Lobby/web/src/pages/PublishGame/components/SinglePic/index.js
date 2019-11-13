import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.scss';
import defaultAvatar from '@/assets/personalcenter/avatar_default.jpg';

import PictureModal from '@/components/PictureModal';

@connect(({ loading }) => ({
    loading: loading.models.personalCenter,
}))
class SinglePic extends Component {
    constructor(props) {
        super(props);
        this.state = {
          visible: false, // 图片弹窗显隐
          imgInfo: {},
        };
    }

    handleCtrlVisble = (targetAttrStr, targeVal) => {
        this.setState({
          [targetAttrStr]: targeVal,
        });
    };

    changeImgUrl = data => {
        // console.log('父组件接收到的更新：', data);
        if(data.GUID !== ''){
            this.setState(
              {
                imgInfo: data[0],
                visible: false,
              },
              () => {
                const { imgInfo } = this.state;
                const { onChange } = this.props;
    
                // 设置头像地址
                onChange(imgInfo);
              },
            );
        }
    };

    render() {
        const { visible } = this.state
        const { initImgUrl } = this.props
        return (
            <div>
                {
                    initImgUrl !== '' ?
                    <div onClick={() => this.handleCtrlVisble('visible', true)} className={`${styles.uploadIcon} ${styles.floor} ${styles['game-icon']}`}>
                    <img src={initImgUrl ? initImgUrl : defaultAvatar} alt=""/>
                    <p className={styles.txt}>
                    {formatMessage({id:'publish_change_icon'})}
                    <br/>
                    {formatMessage({id:'publish_change_icon02'})}
                    </p>
                    </div>
                    :
                    <div onClick={() => this.handleCtrlVisble('visible', true)} className={`${styles.uploadIcon} ${styles.floor}`}>
                        <span className={styles.btn}><Icon type="plus" /></span>
                        <p className={styles.txt}>{formatMessage({id:'publish_add_icon'})}</p>
                    </div>
                }
                {visible ? (
                <PictureModal
                    visible={visible}
                    title={formatMessage({ id: 'publish_upload_game_ico' })}
                    modalCancel={() => this.handleCtrlVisble('visible', false)}
                    onDataChange={this.changeImgUrl}
                    initObj={{
                    Height: 250,
                    Width: 250,
                    Value: initImgUrl,
                    }}
                />
                ) : null}
            </div>
        );
    }
}

export default SinglePic;
