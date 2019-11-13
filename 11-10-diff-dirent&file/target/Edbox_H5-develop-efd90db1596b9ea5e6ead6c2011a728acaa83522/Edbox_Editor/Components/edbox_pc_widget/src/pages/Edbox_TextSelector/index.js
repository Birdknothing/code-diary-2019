import React, { Component } from 'react';
import { Spin, Button, Icon } from 'antd';
import { connect } from 'dva';
import {formatMessage}  from 'umi/locale';
import Header from '@/components/header';
import FontFamily from '@/components/fontfamily';
import FontSize from '@/components/fontsize';
import FontColor from '@/components/color';
import FontStyle from '@/components/fontstyle';
import FontAlignment from '@/components/fontalignment';
import FontSymbol from '@/components/fontsymbol';
import Label from '@/components/label';
import Iconfont from '@/components/iconfont';
import '../../common.scss'
import styles from './index.scss';

@connect(({ textSelector }) => ({
    textSelector
}))

class TextSelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            originalData: null,
            showMoreTools: true,
            isRest: false
        } 
    }

    //文本编辑控件数据初始化
    componentWillMount() {
        const { Edbox } = window;
        const { textSelector, dispatch } = this.props;
        const that = this; 
        
        Edbox.Start();
        Edbox.Message.AddMessageHandler("Init", function (datas, com) {
            that.setState({
                loading: false,
                originalData:datas[0]
            })
            if(!datas[0].Style) {
                datas[0].Style = textSelector.Style              
            }      

            dispatch({
                type: 'textSelector/initTextSelector',
                payload: datas[0]
            })
        })
    }

    //组件更新，广播消息
    componentWillReceiveProps(nextProps) {

        const { Edbox } = window;
        const { textSelector } = nextProps; 
        
        //传递数据给通用框架
        Edbox.Message.Get(window, function(com) {
            com.Start();
            Edbox.Message.Broadcast("Update", [textSelector]);
        })
    }

    //更新字体
    handleUpdateFontFamily(fontFamily) {
        const { dispatch } = this.props;
        dispatch({
            type: 'textSelector/setFontFamily',
            payload: fontFamily
        })
    }

    //更新字体颜色
    handleUpdateFontColor(color) {
        const { dispatch } = this.props;
        dispatch({
            type: 'textSelector/setFontColor',
            payload: color
        })
    }

    //更新字体大小
    handleUpdateFontSize(textSelector) {
        const { dispatch } = this.props;
        dispatch({
            type: 'textSelector/setFontSize',
            payload: textSelector
        })
    }

    //更新字体样式
    handleUpdateFontStyle(fontStyle) {
        const { dispatch } = this.props;
        dispatch({
            type: 'textSelector/setFontStyle',
            payload: fontStyle
        })
    }

    //更新文字对齐方式
    handleUpdateFontAlign(align) {
        const { dispatch } = this.props;
        dispatch({
            type: 'textSelector/setFontAlign',
            payload: align
        })
    }
    
    //设置项目符号
    handleUpdateFontSymbol(value) {
        const { dispatch, textSelector } = this.props;
        let { Type, Value } = textSelector;

        const isSymbolValue = textSelector.SymbolValue;

        let valueStr = ''
        let textValue = textSelector.Value;
        let symbolValue = value;         

        // 文本框不是TextO3时候的操作
        if(Type !== 'Text03') {
            // 如果原来以及有项目符号，则把项目符号替换成空
            if(isSymbolValue) {
                textValue = textValue.replace(new RegExp(isSymbolValue,'g'), '');
            }

            const valueArr = textValue.split(/\n/);

            // 设配多行文本中换行后，每行都自动增加项目符号
            for(let i=0; i<valueArr.length; i++){
                //为空行时，则不增加项目符号
                const iTempValue = valueArr[i]
                if(valueArr[i].trim() === ''){
                    if(i === valueArr.length-1) {
                        valueStr += iTempValue
                    }else{
                        valueStr += iTempValue + '\n';
                    }
                }else{
                    if(i === valueArr.length-1) {
                        valueStr += value + valueArr[i];
                    }else{
                        valueStr += value + valueArr[i] + '\n';
                    }
                }      
            }

            Value = valueStr;
        } 

        if(Type === 'Text03') {
            // 如果原来以及有项目符号，则把项目符号替换成空
            if(isSymbolValue) {
                for(let i=0; i<textValue.length; i++) {
                    textValue[i] = textValue[i].replace(new RegExp(isSymbolValue,'g'), '');
                }
            }

            let textValueTem = []
            for(let i=0; i<textValue.length; i++) {
                textValueTem[i] = value + textValue[i];
            }
            Value = textValueTem;
        }


        const symbolObj = {
            SymbolValue: symbolValue,
            // TextValue: textValue,
            Value: Value
        }

        // 设置项目符号是否重制，如果是重制，则把初始值替换为“无”或者“NO”
        this.setState({
            isRest: false
        })
        
        dispatch({
            type: 'textSelector/setFontSymbol',
            payload: symbolObj
        }) 
    }

    //重制文本编辑内容
    handleRest() {
        const { dispatch } = this.props;
        dispatch({
            type: 'textSelector/initTextSelector',
            payload: this.state.originalData
        })

        this.handleUpdateFontSymbol(''); // 如果是重制，则项目符号置空
        this.setState({
            isRest: true
        })


    }

    handleMoreTools() {
        const {showMoreTools} = this.state;
        this.setState({
            showMoreTools: !showMoreTools
        });
    }
    render() {
        const { Edbox } = window;
        const host = Edbox.ServerKey;
        const { textSelector } = this.props;
        const { showMoreTools, isRest } = this.state;
        const fontFamily = textSelector.Style.fontFamily;
        const fontSize = textSelector.Style.fontSize;
        const fontColor = textSelector.Style.fontColor;
        const fontStyle = textSelector.Style.fontStyle; 
        let fontAlign =  textSelector.Style.align; 
        const readOnly = textSelector.ReadOnly;
        let { symbolValue } = textSelector;

        // 判断symbolValue属性是否存在，如果不存在，则传递Value值中的第一个字符到FontSymbol组件中，进行判断这个字符是否为项目符号
        if(symbolValue === undefined){
            symbolValue = textSelector.Type === 'Text03' ? textSelector.Value[0].toString().substr(0,1) : textSelector.Value.toString().substr(0,1);

        }
        const fontFamilyDisabled = !(textSelector.Property !== undefined && textSelector.Property.FontFamily === true && textSelector.Style.fontFamily !== undefined && textSelector.Style.fontFamily !== {});

        const FontAlignmentDisabled = !(textSelector.Property !== undefined && textSelector.Property.Align === true);
        
        //对齐属性为空是，则设置对齐属性为false;
        fontAlign = fontAlign === undefined ? false : fontAlign;
        return(
            <div className="wrapper">
            <div className="wrapper-border">
                <div className="page-wrap page-wrap-nopadding">
                {this.state.loading ?
                <div className={"index-loading"}>
                    <Header/>
                    <Spin size="large" className={"index-loading-box"} />
                </div>
                :
                <div>
                    <Header title={formatMessage({id: 'edit_text'})}/>
                    <FontFamily config={fontFamily} disabled={fontFamilyDisabled} onUpdate={this.handleUpdateFontFamily.bind(this)  }/>
                    <FontSize config={fontSize} onUpdate={this.handleUpdateFontSize.bind(this)}/>
                    <FontColor color={fontColor} onUpdate={this.handleUpdateFontColor.bind(this)} className="row"/>
                    <FontStyle config={fontStyle} onUpdate={this.handleUpdateFontStyle.bind(this)} />
                    <FontAlignment value={fontAlign} disabled={FontAlignmentDisabled} onUpdate={this.handleUpdateFontAlign.bind(this)}/>
                    <FontSymbol isRest={isRest} onUpdate={this.handleUpdateFontSymbol.bind(this)} symbolValue={symbolValue} disabled={readOnly} />
                    <div className={`${styles['more-tools']} widget no-borderbottom`}>
                        <Label name={formatMessage({id: 'more_tools'})} inline/>
                        <Icon type="down" className={`${styles['btn-expand']} ${showMoreTools ? styles['on'] : ''}`} onClick={this.handleMoreTools.bind(this)}/>
                        {
                            showMoreTools ?
                            <ul>
                                {host !== 'US' ?
                                    <li>
                                    <a href="http://www.wenangou.com/xieyin.html" target="_blank" rel="noopener noreferrer">
                                        <div className={styles['icon']}>
                                            <Iconfont type="icon-ta"/>
                                        </div>
                                        <span>{formatMessage({id: "generator"})}</span>
                                    </a>
                                </li>
                                :
                                <li className={styles['link-txt-gen']}>
                                    <a href="http://max.marrone.nyc/Markov-Word-Generator/" target="_blank" rel="noopener noreferrer">
                                        <div className={styles['icon']}>
                                                <i>Text</i>
                                        </div>
                                        <span>{formatMessage({id: "text_generator"})}</span>
                                    </a>
                                </li>
                                }
                            </ul>
                            : null
                        }
                    </div>
                    <div className="btm-btns">
                        <Button onClick={this.handleRest.bind(this)}>{formatMessage({ id: 'reset' })}</Button>
                    </div>
                </div>
                }
                </div>
            </div>
            </div>
        )
    }
}

export default TextSelect;