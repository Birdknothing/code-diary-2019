import React, {Component} from 'react';
import {Input} from 'antd';
import styles from './index.scss';

class Color extends Component{

    constructor(props) {
        super(props);
        this.state = {
            color: this.props.value
        }
        
    }

    //自定义颜色
    handleChange(e){
        let color = e.currentTarget.value;
        color = color.indexOf('#') === 0 ? color : '#' + color;
        color = color.length > 7 ? color.slice(0,7) : color;
        this.setState({
            color: color
        })
        this.props.onUpdate(color);
    }

    //颜色列表选择颜色
    handleColorListChange(color){
        this.setState({
            color: color
        })
        this.props.onUpdate(color);
    }

    //判断颜色是否为白色
    isWhite(color){
        const colorValue = color.replace('#', '').toLowerCase();
        const isWhite = colorValue === 'fff' || colorValue === 'ffffff';
        return isWhite;
    }
    
    render() {
        const {colorList} = this.props;
        const color = this.state.color;

        return (
            <div className={styles['color']}>
                <ul className={`${styles['color-list']} clearfix`}>
                    {
                        colorList.map(color =>
                            <li className={`${styles['item']} ${this.isWhite(color) ? styles['sp'] : '' }`} key={color} style={{backgroundColor: color}} onTouchStart={this.handleColorListChange.bind(this, color)}></li>
                        )
                    }
                </ul> 
                <div className={`${styles['custom']} clearfix`}>
                    <label>Custom color</label>
                    <div className={styles['color-input']}>
                        <span className={this.isWhite(color) ? styles['white-border'] : ''} style={{backgroundColor: color}}></span>
                        <Input value={color} onChange={this.handleChange.bind(this)}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Color;