import React, { Component } from 'react';
import { Icon, Button, Badge, Modal } from 'antd';
import moment from 'moment';
import { formatMessage } from 'umi/locale'
import { connect } from 'dva'
import styles from './List.scss';

@connect(({ FeedBack }) => ({
    FeedBack: FeedBack
}))
class List extends Component {
    constructor(props){
        super(props)
        this.state = {
            data: this.props.data,
            previewVisible: false,
            previewImage:'',
            dentryId: [],
            content: '',
            imageArr:[]
        }
    }
    componentWillMount(){
        this.handleContent(this.props.data.screenshot)
    }

    handlePicBox = (url) =>{
        this.setState({
            previewImage: url,
            previewVisible: true
        })
    }

    handleContent = (arr) =>{
        const { dispatch } = this.props
        const _this = this
        const dentryId = arr
        if(dentryId.length > 0){
            let img = []
            dentryId.forEach((item,i)=>{
                dispatch({
                    type: 'FeedBack/getImage',
                    payload:{
                        id:item
                    },
                    callback(data){
                        img = img.concat(data.url)
                        _this.setState({
                            imageArr: img
                        })
                    }
                })
            })
        }
    }

    handleCancel = () => this.setState({ previewVisible: false });
    render() {
        const { previewVisible, previewImage, imageArr } = this.state
        const { data } = this.props
        return (
            <div className={`${styles['list']}`}>
                <div className={styles['statu']}>
                    {
                        data.reply_status === 0 ?
                        <Badge dot={false}>{data.status === 0 ? formatMessage({id:'feedback_unsolved'}) : formatMessage({id:'feedback_solved'})}</Badge>
                        :
                        <Badge dot={true}>{formatMessage({id:'feedback_new_comment'})}</Badge>
                    }
                </div>
                <div className={styles['txt']}>[{formatMessage({id:'feedback_type'})}] {data.feedback_type}</div>
                <div className={styles['txt']}>[{formatMessage({id:'feedback_scene'})}] {[].concat(data.scene).join(',')}</div>
                <div className={`${styles['txt']} ${styles['elli']}`}>[{formatMessage({id:'feedback_subscript'})}] {data.content}</div>
                <div className={styles['img']}>
                    {imageArr.map((item,i)=>(
                        <span key={i} onClick={()=>this.handlePicBox(item)}><img src={item} alt=""/></span>
                    ))}
                </div>
                <div className={styles['bot']}>
                    <span><Icon type="clock-circle" /> {moment(data.last_reply_time).format('YYYY-MM-DD HH:mm:ss')}</span>
                    <Button onClick={()=>this.props.onDetail(data.id,data)} className={styles['btn']} size="small" type="primary">{formatMessage({id:'details'})}</Button>
                </div>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default List;