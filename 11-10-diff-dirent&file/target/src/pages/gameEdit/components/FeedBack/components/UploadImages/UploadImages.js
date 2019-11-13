import React, { Component } from 'react';
import { Icon, Upload, Message } from 'antd';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva'
import styles from './UploadImages.scss';
import defaultBg from '@/assets/bg_img.png';

@connect(({ FeedBack }) => ({
    FeedBack: FeedBack
}))
class UploadImages extends Component {
    constructor(props){
        super(props)
        this.state = {
            config: this.props.config,
            loadingList: []
        }
    }

    handleBeforeUpload= file => {
        // 检查图片大小[暂无需求]
        // 检查文件类型
        const imageType = file.type.split('/')[1];
        const size = file.size / 1024 / 1024 < 5
        if (this.state.config.ImageType.indexOf(imageType) === -1) {
          Message.info(formatMessage({ id: 'invalid_image_type' }));
          return false;
        }
        if (!size) {
            Message.info(formatMessage({ id: 'publish_image_size_error' }));
            return false;
        }
        this.handleUpload(file);
        return true;
    }

    handleUpload = file =>{
        const { dispatch,config } = this.props
        const { loadingList } = this.state;
        const _this = this
        if(!file){
            return false;
        }
        loadingList.push('loading');
        this.setState({
            loadingList: [...loadingList]
        })
        dispatch({
            type:'FeedBack/uploadImage',
            payload: {file},
            callback(data){
                if(data.data && data.data.error){
                    // console.log(data)
                    Message.info(formatMessage({ id: 'feedback_error_file' }));
                    loadingList.pop();
                    _this.setState({
                        config:{ ...config },
                        loadingList: [...loadingList]
                    })
                    _this.props.onUpdate(config)
                }else{
                    loadingList.pop();
                    config.Value.push(data.url)
                    config.dentyID.push(data.dentry_id)
                    _this.setState({
                        config:{ ...config },
                        loadingList: [...loadingList]
                    })
                    _this.props.onUpdate(config)
                }
            }
        })
    }

    handleRemove = index =>{
        const { config } = this.state;
        config.Value.splice(index, 1);
        config.dentyID.splice(index, 1);
        this.setState({
            config: { ...config },
        });
        this.props.onUpdate(config)
    }

    render() {
        const {
            // config: { Value },
            loadingList,
        } = this.state;
        const { config:{Value}} = this.props
        const uploadBtn = (
        <div className={styles['btn-content']}>
            <span className={styles['ico-plus']}><Icon type="plus" /></span>
            <p className={styles['hint']}>{formatMessage({ id: 'publish_upload_images' })}</p>
            {/* <p className={styles['rule']}>
            {formatMessage({ id: 'publish_image_accept' }) + ImageType.join('/')} , {formatMessage({ id: 'publish_image_size' })}5M
            </p> */}
        </div>
        );
        return (
            <div className={`${styles['img-upload']} clearfix`}>
                <Upload
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={this.handleBeforeUpload}
                    multiple={false}
                    disabled={loadingList.length > 0}
                    // onRemove={this.handleRemove.bind(this)}
                    className={styles['btn-upload']}
                    accept={'.jpg,.png,.jpeg'}
                >
                    {Value.length >= 5 ? null : uploadBtn}
                </Upload>
                <ul className={`${styles['img-list']} clearfix`}>
                    {Value && Value.length
                    ? Value.map((url, i) => (
                        <li
                            key={i}
                            style={{ backgroundImage: `url(${url ? url : defaultBg})` }}
                            className={!url ? styles['img-err'] : ''}
                        >
                            <div className={styles['actions']}>
                            <Icon type="close" onClick={this.handleRemove} />
                            </div>
                        </li>
                        ))
                    : null}
                    {loadingList && loadingList.length
                    ? loadingList.map((item, i) => (
                        <li key={i}>
                            <Icon type="loading" className={styles['loading']} />
                        </li>
                        ))
                    : null}
                </ul>
            </div>
        );
    }
}

export default UploadImages;