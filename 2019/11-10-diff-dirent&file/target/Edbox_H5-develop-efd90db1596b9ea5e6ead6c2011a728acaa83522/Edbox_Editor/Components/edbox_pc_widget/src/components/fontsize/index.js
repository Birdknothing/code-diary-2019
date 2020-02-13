import React, {Component} from 'react';
import {Select} from 'antd';
import {formatMessage} from 'umi/locale';
import Label from '@/components/label';
import IconButton from '@/components/iconbutton';
import styles from './index.scss';

class FontSize extends Component {

    constructor(props) {
        super(props);
        this.state = {
            size: this.props.config.size,
            startNum: this.props.config.startNum,
            endNum: this.props.config.endNum,
            isAddDisabled: false,
            isDecreaseDisabled: false
        }
    }

    componentWillReceiveProps(nextProps){
        const { size, startNum, endNum } = nextProps.config;
        this.setState({
            size,
            startNum,
            endNum
        })
    }

    handleChangeFontSize(value) {
        const { startNum, endNum } = this.state;

        // 选择最小字体时的操作
        if(value <= startNum) {
            this.setState({ 
                isDecreaseDisabled: true,
                isAddDisabled: false
            })
        }else if(value >= endNum) { // 选择最大字体时的操作
            this.setState({ 
                isDecreaseDisabled: false,
                isAddDisabled: true
            })
        }else{// 其他情况处理
            this.setState({ 
                isDecreaseDisabled: false,
                isAddDisabled: false
            })
        }

        this.setState({size: value});
        this.props.onUpdate({
            size: value,
            startNum,
            endNum
        })
    }

    handleIncreaseClick() { 
        const { size, startNum, endNum, isDecreaseDisabled } = this.state;
        
        if(size < endNum) {
            const newSize = this.state.size+ 1;

            // 新的字体大小与设定的最大字体大小相等或者更大时，则设置增加的按钮为不可点击
            if(newSize >= endNum ) {
                this.setState({ isAddDisabled: true });
            }

            // 判断减小字体是否为禁用，如果是则启用该按钮
            if(newSize > startNum ) {
                if(isDecreaseDisabled) {
                    this.setState({ isDecreaseDisabled: false });
                }
            }
            
            this.setState({ size: newSize});
            this.props.onUpdate({
                size: newSize,
                startNum,
                endNum
            })
        }
    }

    handleDecreaseClick() {
        const { size, startNum, endNum, isAddDisabled } = this.state;

        if(size > startNum) {
            const newSize = this.state.size - 1;

            // 新的字体大小与设定的最小字体大小相等或者更小时，则设置减小的按钮为不可点击
            if(newSize <= startNum ) {
                this.setState({ isDecreaseDisabled: true });
            }

            // 判断增大字体是否为禁用，如果是则启用该按钮
            if(newSize < endNum ) {
                if(isAddDisabled) {
                    this.setState({ isAddDisabled: false });
                }
            }
            
            this.setState({ size: newSize });
            this.props.onUpdate({
                size: newSize,
                startNum,
                endNum
            })
        } 
    }

    render() {
        const {Option} = Select;
        const { startNum, endNum, size, isAddDisabled, isDecreaseDisabled } = this.state;

        const numArr = [];
        for (let i=startNum; i<endNum+1; i++) {
            numArr.push(i);
        }

        return (
            <div className="widget">
                <Label name={formatMessage({id: 'size'})} />
                <div className={styles['body']}>
                    <Select 
                    defaultValue={size} 
                    value={size} 
                    className={styles['select']} 
                    onChange={this.handleChangeFontSize.bind(this)}
                    showSearch>
                    {numArr.map(opt => 
                        <Option value={opt} key={opt}>{opt}</Option>)
                    }
                    </Select>
                    <IconButton onClick={this.handleIncreaseClick.bind(this)} noSelected={true} className={isAddDisabled ? styles['btn_disabled'] : ''}>
                        <span>A</span>
                        <sup>+</sup>
                    </IconButton>
                    <IconButton onClick={this.handleDecreaseClick.bind(this)} noSelected={true} className={styles['mr-0'] + (isDecreaseDisabled ? ' ' + styles['btn_disabled'] : '')}>
                        <span>A</span>
                        <sup>-</sup>
                    </IconButton>
                </div>
            </div>
        )
    }
}

export default FontSize;

