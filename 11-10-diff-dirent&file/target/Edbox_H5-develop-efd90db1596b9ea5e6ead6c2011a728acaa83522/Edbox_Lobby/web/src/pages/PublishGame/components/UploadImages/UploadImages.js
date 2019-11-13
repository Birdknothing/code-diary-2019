import React, { Component } from 'react';
import { Icon } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './UploadImages.scss';
import defaultBg from '@/assets/bg_img.png';

import PictureModal from '@/components/PictureModal';

class UploadImages extends Component {
    constructor(props){
        super(props)
        this.state = {
            config: this.props.config,
            loadingList: [],
            visible: false,
            initImgUrl:'',
            editIndex:'new'
        }
    }

    componentWillMount(){
        this.setState({
            config: this.props.config,
        })
    }

    changeImgUrl = data => {
        console.log('父组件接收到的更新：', data);
        const { config } = this.props
        const { ID,Value } = config
        // GUID.splice(data[0].editIndex, 1);
        // Value.splice(data[0].editIndex, 1);
        // if(data[0].GUID !== ''){
            if(data[0].editIndex === 'new'){
                this.setState({
                    config: {
                        ...config,
                        ID: ID.concat(data[0].GUID),
                        Value: Value.concat(data[0].Value)
                    },
                    visible: false,
                  },() => {
                    const { config } = this.state;
                    const { onUpdate } = this.props;

                    // 设置头像地址
                    onUpdate(config);
                  },
                );
            }else{
                Value.splice(data[0].editIndex, 1,data[0].Value)
                ID.splice(data[0].editIndex, 1,data[0].GUID)
                this.setState({
                    config: {
                        ...config,
                        ID: ID,
                        Value: Value
                    },
                    visible: false,
                  },() => {
                    const { config } = this.state;
                    const { onUpdate } = this.props;

                    // 设置头像地址
                    onUpdate(config);
                    console.log(config)
                  },
                );
            // }
        }


    };

    handleRemove = index =>{
        const { config } = this.props;
        config.Value.splice(index, 1);
        config.ID.splice(index, 1);
        this.setState({
            config: { ...config },
        });
        this.props.onUpdate(config)
    }

    handleEdit = index =>{
        const { config } = this.props;
        console.log(index)
        this.setState({
            initImgUrl: config.Value[index],
            visible: true,
            editIndex: index
        })
        // config.Value.splice(index, 1);
        // config.ID.splice(index, 1);
        // this.setState({
        //     config: { ...config },
        // });
        // this.props.onUpdate(config)
    }

    handleCtrlVisble = (targetAttrStr, targeVal) => {
        this.setState({
          [targetAttrStr]: targeVal,
          initImgUrl:'',
          editIndex: 'new'
        });
    };

    render() {
        const {
            // config: { ImageType, Value},
            loadingList,
            visible,
            initImgUrl,
            editIndex
        } = this.state;
        const { config: { Value }} = this.props
        const ImageType = ["png","jpeg","jpg"];
        // const { initImgUrl } = this.props
        // const initImgUrl = 'http://iph.href.lu/100x100'
        const uploadBtn = (
            <div
            onClick={()=>this.handleCtrlVisble('visible',true)}
            className={styles['btn-content']}>
                <span className={styles['ico-plus']}><Icon type="plus" /></span>
                <p className={styles['hint']}>{formatMessage({ id: 'publish_upload_images' })}</p>
                <p className={styles['rule']}>
                {formatMessage({ id: 'publish_image_accept' }) +' '+ImageType.join('/')}</p>
            </div>
        );
        return (
            <div className="img-upload clearfix">
                {/* <Upload
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={this.handleBeforeUpload}
                    multiple={false}
                    disabled={loadingList.length > 0}
                    // onRemove={this.handleRemove.bind(this)}
                    className={styles['btn-upload']}
                >
                    {Value.length >= 5 ? null : uploadBtn}
                </Upload> */}
                {Value.length >= 5 ? null : uploadBtn}

                <ul className={`${styles['img-list']} clearfix`}>
                    {Value && Value.length
                    ? Value.map((url, i) => (
                        <li
                            key={i}
                            style={{ backgroundImage: `url(${url ? url : defaultBg})` }}
                            className={!url ? styles['img-err'] : ''}
                        >
                            <div className={styles['actions']}>
                            <Icon className={styles['action-close']} type="close" onClick={()=>this.handleRemove(i)} />
                            <Icon className={styles['action-edit']} type="edit" onClick={()=>this.handleEdit(i)}/>
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
                {visible ? (
                <PictureModal
                    visible={visible}
                    title={formatMessage({ id: 'publish_upload_game_screen' })}
                    modalCancel={() => this.handleCtrlVisble('visible', false)}
                    onDataChange={this.changeImgUrl}
                    initObj={{
                    Height: 250,
                    Width: 250,
                    Value: initImgUrl,
                    editIndex: editIndex,
                    ImageType: ['png', 'jpg', 'jpeg'],
                    }}
                />
                ) : null}
            </div>
        );
    }
}

export default UploadImages;
