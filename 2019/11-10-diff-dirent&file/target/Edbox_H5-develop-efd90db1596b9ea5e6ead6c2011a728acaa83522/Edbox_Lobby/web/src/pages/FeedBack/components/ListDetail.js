import React, { Component } from 'react';
import moment from 'moment';
import { Icon, Modal } from 'antd';
import { formatMessage } from 'umi/locale'
import { connect } from 'dva'
import styles from './List.scss';

@connect(({ FeedBack }) => ({
    FeedBack: FeedBack
}))
class ListDetail extends Component {
    constructor(props){
        super(props)
        this.state = {
            data: this.props.data,
            previewVisible: false,
            previewImage:'',
            content: '',
            imageArr:[]
        }
    }
    
    componentWillMount(){
        const { data } = this.state
        this.setState({
            content: data.content.replace(/<dentryId(([\s\S])*?)<\/dentryId>/g, '')
        })
        this.handleContent(data.content)
    }

    handlePicBox = (url) =>{
        this.setState({
            previewImage: url,
            previewVisible: true
        })
    }

    handleContent = (content) =>{
        const { dispatch } = this.props
        const _this = this
        const arr = content.match(/[^><]+(?=<\/dentryId>)/img)
        const arr2 = this.props.data.screenshot
        if(arr2){
            const dentryId = arr2
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
        }else if(arr){
            const dentryId = arr[0].split(",")
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
        const { data, previewVisible, previewImage, content, imageArr } = this.state
        const { scene } = this.props
        return (
            <div className={`${styles['list']} ${styles['card']}`}>
                {
                    data.isLz ? 
                    <div className={styles['txt']}>[{formatMessage({id:'feedback_type'})}] {data.feedback_type}</div>
                    :
                    null
                }
                {
                    data.isLz?
                    <div className={styles['txt']}>[{formatMessage({id:'feedback_scene'})}] {[].concat(scene).join(',')}</div>
                    :
                    null
                }
                {
                    data.isLz ? 
                    <div className={`${styles['txt']}`}>[{formatMessage({id:'feedback_subscript'})}] {content}</div>
                    :
                    <div className={`${styles['txt']}`}>{content}</div>
                }
                <div className={styles['img']}>
                    {imageArr.map((item,i)=>(
                        <span key={i} onClick={()=>this.handlePicBox(item)}><img src={item} alt=""/></span>
                    ))}
                </div>
                <div className={styles['bot']}>
                    <span><Icon type="clock-circle" /> {moment(data.reply_time).format('YYYY-MM-DD HH:mm:ss')}</span>
                    {/* {btn && <Button onClick={()=>this.props.onDetail(data.id)} className={styles['btn']} size="small" type="primary">Detail</Button>} */}
                </div>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default ListDetail;