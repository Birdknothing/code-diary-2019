import React, { Component } from 'react';
import { Icon, Modal } from 'antd';
import styles from './List.scss'

class Card extends Component {
    constructor(props){
        super(props)
        this.state = {
            data: this.props.data,
            previewVisible: false,
            previewImage:'',
        }
    }

    handlePicBox = (url) =>{
        this.setState({
            previewImage: url,
            previewVisible: true
        })
    }

    handleCancel = () => this.setState({ previewVisible: false });
    render() {
        const { data, previewVisible, previewImage } = this.state
        return (
            <div className={`${styles['list']} ${styles['card']}`}>
                <div className={`${styles['txt']}`}>{data.ps}</div>
                {/* <div className={styles['img']}>
                    {data.img.Value.map((item,i)=>(
                        <span key={i} onClick={()=>this.handlePicBox(item)}><img src={item} alt=""/></span>
                    ))}
                </div> */}
                <div className={styles['bot']}>
                    <span><Icon type="clock-circle" /> 2019-05-27 21:09</span>
                </div>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

export default Card;