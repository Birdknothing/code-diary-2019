import React, {Component} from 'react';
import {formatMessage}  from 'umi/locale';
import {Select} from 'antd';
import Label from '@/components/label';
import styles from './index.scss';


class FontFamily extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: this.props.config,
            tag: '4a16d354-d92a-4250-9552-21f6e4bdf7a9',
            key: '',
            page: 1,
            size: 20,
            count: 0,
            defaultID: 'a39d1544-1cee-4d34-bc94-eafb6a0c6e26',
            isShowDefault: false,
            fontFamilyListArr : [],
            total_count: 0
        }
    }
    

    componentWillMount(){
        const { Edbox } = window;
        const {tag, key, page, size, defaultID} = this.state;
        const { config, disabled } = this.props;

        //获取字体资源
        Edbox.FrontendLib.GetResources(
            tag, 
            key, 
            page, 
            size, 
            result => {
                // 判断传递过来的字体是否在字体列表中，如果不在，则直接使用默认字体
                let isShowDefault = false;
                if(!disabled) {
                    isShowDefault = !this.isHaveFont(config.id, result.items); 
                }
                this.setState({
                    count: result.item_count,
                    fontFamilyListArr : result.items,
                    total_count: result.total_count,
                    isShowDefault: isShowDefault
                })
            },
            error => {
                console.error(error, 'error');
            }
        )
    }

    componentWillReceiveProps(nextProps){
        this.setState({...nextProps.config});
    }

    // 选择字体时的操作
    handleFontFamily(value, event) {
        const name = event.props.title;
        this.setState({
            confing: {id: value, name: name}
        });
        this.props.onUpdate({id: value, name: name});
    }

    // 判断游戏传递过来的字体ID是否在字体列表中
    isHaveFont(id, fontArr) {
        for(let i=0; i<fontArr.length; i++) {
            if(fontArr[i].id === id) {
                return true;
            }
        }
        return false;
    }

    render() {
        const {Option} = Select;
        const { isShowDefault, fontFamilyListArr, defaultID } = this.state
        const { config, disabled } = this.props;
        const fontFamilyList = fontFamilyListArr;
        let showFontId = defaultID;
        if(!disabled) {
            showFontId = isShowDefault ? defaultID : config.id;
        }

        return (
            <div className="widget">
                <Label name={formatMessage({id: 'font'})}/>
                <Select
                    value={showFontId}
                    className={styles['select'] + ' no-bg-color'} 
                    onChange={this.handleFontFamily.bind(this)} 
                    disabled={disabled}
                    >
                    {fontFamilyList && fontFamilyList.length? 
                        fontFamilyList.map(opt => 
                            <Option 
                            value={opt.id} 
                            key={opt.id} 
                            title={opt.title}
                            className={styles['font-item']}
                            >
                                <img src={opt.cover} alt="" />
                            </Option>
                        )
                        :null
                    }      
                </Select>
            </div>
        )
    }
}

export default FontFamily;