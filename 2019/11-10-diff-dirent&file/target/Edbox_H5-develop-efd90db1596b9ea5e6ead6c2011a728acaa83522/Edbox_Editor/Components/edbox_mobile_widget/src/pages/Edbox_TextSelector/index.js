import React, {Component} from 'react';
import {Button, Flex} from 'antd-mobile';
import {connect} from 'dva';
import ActionSheet from '@/components/ActionSheet';
import Iconfont from '@/components/Iconfont';
//import Header from '@/components/Header';
//import FontFamily from '@/components/FontFamily';
import FontSize from '@/components/FontSize';
import Color from '@/components/Color';
import styles from './index.scss';

const FlexItem = Flex.Item;

@connect(({textEditor}) => ({textEditor}))

class TextSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textareaWidth: 0,
            textareaHeight: 0,
            textareaHeightStep: 0,
            textareaValue: this.props.textEditor.Value,
            edit: false,
            actionSheetHeight: 100,
            currentAction: 0, // 0=>键入; 1=>字体; 2=>大小; 3=>颜色
            textValue:'', //存储初始化的值
            editAreaShow: false, //文本框及其背景是否需要显示
            tabDisable: true, //tab是否禁用
            tabCurrent: null
        }
    }

    //文本编辑控件数据初始化
    componentWillMount(){
        const { Edbox } = window;
        const { textEditor, dispatch } = this.props;
        const that = this;

        //初始化，更新默认数据
        Edbox.Message.AddMessageHandler("Init", function (datas, com) {
            //数据为空则不初始化
            if(Object.keys(datas).length === 0) return;

            if(!datas.Style) {
                datas.Style = textEditor.Style;              
            } 

            that.setState({
                textValue : datas.Value,
                textareaValue: datas.Value,
                tabDisable: false
            })

            that.handleActionChange();

            //与本地的值相等，则不dispatch
            if(JSON.stringify(datas) !== JSON.stringify(that.props.textEditor)){
                dispatch({
                    type: 'textEditor/initTextSelector',
                    payload: datas
                })
            }
            
        })       
    }

    //组件更新，广播消息
    componentWillReceiveProps(nextProps) {
        const { Edbox } = window;
        const { textEditor } = nextProps;
        //传递数据给通用框架
        
        if(this.props.textEditor.ID === '') return;

        Edbox.Message.Get(window, function(com) {          
            com.Start();
            Edbox.Message.Broadcast("Update", textEditor);
        })
    }

    //输入文字文本框获得焦点
    handleFocus () {
        this.textarea.focus();
        this.setState({
            edit: true
        });
    }

    //输入文字文本框失去焦点
    handleBlur() {
        this.setState({
            edit: false
        });
    }

    //文字修改
    handleTextChange(e) {
        const textarea = e.target;
        const {textareaHeightStep, textareaHeight} = this.state;
 
        this.setState({
            textareaValue: e.target.value
        });

        //控制文本输入框，根据文字内容进行伸缩
        if (textarea.scrollHeight >= textarea.offsetHeight) {
            const step = textarea.scrollHeight - textarea.offsetHeight;
            if (!textareaHeightStep) {
                this.setState({
                    textareaHeightStep: step
                })
            }
            this.setState({
                textareaHeight: textarea.scrollHeight
            })
        } else {
            this.setState({
                textareaHeight: textareaHeight - textareaHeightStep
            })
        }
    }

    //文字字体大小修改
    handleFontSizeChange (fontSize) { 
        if(!Number.isInteger(fontSize)) return
        const {dispatch} = this.props;
        dispatch({
            type: 'textEditor/changeFontSize',
            payload: {
                ...this.props.textEditor.Style.fontSize,
                size: fontSize
            }
        }) 
    }

    //更新字体颜色
    handleUpdateFontColor(color) {      
        const { dispatch } = this.props;
        dispatch({
            type: 'textEditor/changeFontColor',
            payload: color
        })
    }

    //设置文本框及背景是否显示
    editAreaShow(value){
        this.setState({
            editAreaShow: value
        });
    }

    //重制文本框的值
    resetValue(){
        this.setState({
            textareaValue: this.state.textValue
        });
    }

    //传输文本框的值并隐藏背景
    handleSendValue(){
        const {dispatch} = this.props;
        this.setState({
            editAreaShow: false
        });
        this.sendTabInfo('value', 99);
        dispatch({
            type: 'textEditor/changeValue',
            payload: this.state.textareaValue
        })
    }

    //传输Tab切换相关信息
    sendTabInfo(type, height) {
        const { Edbox } = window;
        Edbox.Message.Get(window, function(com) {          
            com.Start();
            Edbox.Message.Broadcast("TabClick", {
                Type: type,
                Height: height
            });
        })
    }

    //文字控件4个标签切换
    handleActionChange(index) {
        //数据未初始化，Tab按钮功能禁用
        if(this.state.tabDisable) return;
        this.setState({
            tabCurrent: index
        })
        
        const currentAction = index;
        let actionSheetHeight = 100;
        switch (index) {
            case 0:
                this.handleFocus();
                actionSheetHeight = 100;
                this.sendTabInfo('value', 100);
                this.editAreaShow(true);
                break;
            /* case 1:
                actionSheetHeight = 650;
                //this.sendTabInfo('family', 650);
                this.editAreaShow(false);
                break; */
            case 1:
                actionSheetHeight = 320;
                this.sendTabInfo('size', 320);
                this.editAreaShow(false);
                break;
            case 2:
                actionSheetHeight = 450;
                this.sendTabInfo('color', 450);
                this.editAreaShow(false);
                break;
            default:
                actionSheetHeight = 99;
                this.sendTabInfo('value', 99);
                this.editAreaShow(false);
                break;
        }
        this.setState({
            currentAction,
            actionSheetHeight
        })
    }

    render() {
        const { Value, Style } = this.props.textEditor;       
        const { fontSize, fontColor } = Style;
        const {textareaWidth, textareaHeight, actionSheetHeight, currentAction} = this.state;
        //const FlexItem = Flex.Item;
        //const {designWidth} = window;
        //const realFontSize = fontSize / designWidth;
        const edit = this.state.edit;
        /* let textareaStyles = {
            fontFamily, 
            fontSize: `${realFontSize}rem`, 
            fontColor
        } */
        const colorList = [
            '#fff', '#f00', '#ff7200', '#fffc00', '#84ff00', '#12ff00', '#00ffd2', '#008aff', '#1800ff', '#7800ff', '#c600ff', '#ff00f6', '#ff007e', '#f0f0f0', '#d5d5d5', '#a3a3a3', '#707070', '#000'
        ]
        const tabDisable = this.state.tabDisable;
        let textareaStyles = {};
        if (textareaWidth) {
            textareaStyles.width = textareaWidth
        }
        if (textareaHeight) {
            textareaStyles.height = textareaHeight
        }

        const current = this.state.tabCurrent;

        return (
            <div className="page-wrap white">
                <div className={styles['edit-area']} style={this.state.editAreaShow ? {display:'block'} : {display:'none'}}>
                    <textarea className={styles['textarea']} id="textarea" value={this.state.textareaValue} onChange={this.handleTextChange.bind(this)} style={textareaStyles} ref={textarea => this.textarea = textarea} onBlur={this.handleBlur.bind(this)} onFocus={this.handleFocus.bind(this)}></textarea>
                    <div className={styles['hidden-txt']} ref={hiddenTextContainer => this.hiddenTextContainer = hiddenTextContainer}>{Value}</div>
                    {
                        edit && currentAction === 0 ? 
                        <div className={styles['edit-btns']}>
                            <Button className={styles['btn-reset']} onTouchStart={this.resetValue.bind(this)}>
                                <Iconfont type="icon-reset"/>
                            </Button>
                            <Button type="primary" className={styles['btn-confirm']} onTouchStart={this.handleSendValue.bind(this)}>
                                <Iconfont type="icon-success"/>
                            </Button>
                        </div>
                        : null
                    }
                </div>
                
                <ActionSheet className={`${styles['action-sheet']} text-action-sheet`} height={actionSheetHeight}>
                    <div className={tabDisable ? styles['disabled'] : ''}>
                    <Flex className={styles['actions']}>  
                        <FlexItem onTouchStart={this.handleActionChange.bind(this, 0)} className={current === 0 ? styles['active'] : ''}>
                            <Iconfont type="icon-keyboard"/>
                        </FlexItem>
                        <FlexItem onTouchStart={this.handleActionChange.bind(this, 1)} className={current === 1 ? styles['active'] : ''}>
                            <Iconfont type="icon-font-size"/>
                        </FlexItem>
                        <FlexItem onTouchStart={this.handleActionChange.bind(this, 2)} className={current === 2 ? styles['active'] : ''}>
                            <Iconfont type="icon-drop"/>
                        </FlexItem>
                    </Flex>
                    </div>
                    {
                        (() => {
                            let el = null;
                            switch (currentAction) {
                                /* case 1:
                                    el = <FontFamily />
                                    break; */
                                case 1: 
                                    el = <FontSize size={fontSize.size} min={fontSize.startNum} max={fontSize.endNum} onChange={this.handleFontSizeChange.bind(this)}/>
                                    break;
                                case 2:
                                    el = <Color value={fontColor} colorList={colorList} onUpdate={this.handleUpdateFontColor.bind(this)}/>
                                    break;
                                default:
                                    break;
                            }
                            return el;
                        })()
                    }
                </ActionSheet>                
            </div>
        )
    }
}

export default TextSelector;


/* <FlexItem>
                            <Iconfont type="icon-a" onClick={this.handleActionChange.bind(this, 1)}/>
                        </FlexItem> */