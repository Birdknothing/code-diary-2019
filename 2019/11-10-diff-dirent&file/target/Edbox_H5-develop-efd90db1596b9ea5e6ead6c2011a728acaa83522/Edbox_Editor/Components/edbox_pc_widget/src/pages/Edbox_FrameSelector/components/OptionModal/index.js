import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Radio, Input } from 'antd';
import { formatMessage } from 'umi/locale'
import styles from './index.scss';

@connect(({ frameSelector }) => ({
    frameSelector
}))
class OptionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: props.visible,
            modalData: props.data,
            radioValue: props.frameSelector.radioValue
        }
    }

    modalCancel = () =>{

        const { modalCancel } = this.props;
        // 优化关闭有动画
        this.setState(
            {
            visible: false
            },
            () => {
            this.closeTimerId = setTimeout(() => {
                if (modalCancel) {
                modalCancel();
                }
            }, 500);
            },
        );
    }
    handleInputCyclic = e =>{
        const { value } = e.target
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if ((!Number.isNaN(value) && reg.test(value)) || value === '') {
            this.setState({
                modalData: value === '' ? value : parseInt(value),
            });
        }
    }

    handleBlurCyclic = e =>{
        const { modalData } = this.state
        if(modalData < 1){
            this.setState({
                modalData: 1
            })
        }else if(modalData > 99){
            this.setState({
                modalData: 99
            })
        }
    }

    handleInputLength = e =>{
        const { value } = e.target
        const { modalData } = this.state
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '') {
            this.setState({
                modalData: {
                    ...modalData,
                    timeLength: value
                }
            });
        }
    }

    handleBlurLength = e =>{
        const { modalData } = this.state
        const { data } = this.props;
        const { chipLength } = data;
        // console.log(modalData, chipLength)
        if(modalData.timeLength < 0.01*chipLength){
            this.setState({
                modalData: {
                    ...modalData,
                    timeLength: 0.01*chipLength
                }
            })
        }else if(modalData.timeLength > 100){
            this.setState({
                modalData: {
                    ...modalData,
                    timeLength: 100
                }
            })
        }
    }

    onChangeRadio = e =>{
        const { dispatch } = this.props;
        this.setState({
            radioValue: e.target.value,
        });
        dispatch({
            type:'frameSelector/setRadioValue',
            payload:{
                radioValue: e.target.value
            }
        })
    }

    handleOk = () =>{
        const { type, modalOk } = this.props;

        if(type === 0){
            const { modalData } = this.state

            modalOk(modalData,type);
            this.modalCancel()
        }
        if(type === 1){
            const { modalData, radioValue } = this.state

            modalOk(modalData.timeLength,type,radioValue);
            this.modalCancel()
        }
    }
    render() {
        const { visible, modalData } = this.state
        const { type } = this.props
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
          };
        return (
            <Modal
                title={type===0 ? formatMessage({id:'cyclic_modal_title'}) : formatMessage({id:'time_modal_title'})}
                centered
                width={286}
                visible={visible}
                className={styles['modal-style']}
                onCancel={this.modalCancel}
                // closable={false}
                onOk={this.handleOk}
            >
                {type === 0 ?
                <div>
                    <label className={styles['label']}>{formatMessage({id:"cyclic_tip"})}</label>
                    <div className={styles['input']}>
                        <Input 
                            value={modalData}
                            onChange={this.handleInputCyclic}
                            onBlur={this.handleBlurCyclic}
                        />
                    </div>
                </div>:null}
                {type === 1 ?
                <div>
                    <div>
                        <label className={styles['label']}>{formatMessage({id:"length_tips"})}</label>
                        <div className={styles['input']}>
                            <Input 
                                value={modalData.timeLength}
                                onChange={this.handleInputLength}
                                onBlur={this.handleBlurLength}
                            />
                        </div>
                        <span style={{marginLeft:'5px'}}>s</span>
                    </div>
                    <div>
                    <Radio.Group onChange={this.onChangeRadio} value={this.state.radioValue}>
                        <Radio style={radioStyle} value={1}>
                        {formatMessage({id:'length_radio_tips'})}
                        </Radio>
                        <Radio style={radioStyle} value={2}>
                        {formatMessage({id:'length_radio_tips02'})}
                        </Radio>
                    </Radio.Group>
                    </div>
                </div>:null}
            </Modal>
        );
    }
}

export default OptionModal;