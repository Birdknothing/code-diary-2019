import React, {Component} from 'react';
import {List, Radio} from 'antd-mobile';
import {connect} from 'dva';
import Iconfont from '@/components/Iconfont';
import styles from './index.scss';
import { longStackSupport } from 'q';

const {RadioItem} = Radio

@connect(({fontList, textEditor}) => ({
    fontList, 
    textEditor
}))

class FontFamily extends Component {

    constructor(props) {
        super(props);
        const initFontList =this.props.fontList.init;
        this.state = {
            fontList: initFontList
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
    }

    handleChange(id, name) {
        const {dispatch} = this.props;
        dispatch({
            type: 'textEditor/changeFontFamily',
            payload: {
                    id: id,
                    name: name
            }
        })
    }
    render() {
        const {textEditor} = this.props;
        const fontList = this.state.fontList;
        const fontId = textEditor.Style.fontFamily.id;
        
        return (
            <List className={`${styles['font-list']} font-list`} onTouchMove={e => e.stopPropagation()}>
                {
                    fontList.map(font => 
                        <RadioItem key={font.id} checked={font.id === fontId} onChange={this.handleChange.bind(this, font.id, font.fontFamily)} style={{fontFamily: font.fontFamily}} className={`${styles['radio-item']} ${font.id === fontId ? 'active' : ''}`}>
                            {font.name}
                            <Iconfont type="icon-success" className={`${styles['ico-check']} ico-check`}/>
                        </RadioItem>
                    )
                }
            </List>
        )
    }
}

export default FontFamily;