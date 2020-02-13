import React, {Component} from 'react';
import {Popover} from 'antd-mobile';
import {formatMessage, getLocale} from 'umi/locale';
import Iconfont from '@/components/Iconfont';
import styles from './index.scss';

const PopoverItem = Popover.Item;

class Search extends Component {
    constructor(props) {
        super(props);
        const {engineList, engineId} = this.props;
        let engineIcon = '';
        if (engineId !== undefined && engineList && engineList.length) {
            for(let i = 0; i < engineList.length; i++) {
                if (engineId === engineList[i].id) {
                    engineIcon = engineList[i].icon;
                    break;
                }
            }
        } else {
            engineIcon = engineList[0].icon
        }
        this.state = {
            engineIcon: engineIcon,
            popoverVisible: false
        }
    }
    /**
     * 处理选中某个引擎时的操作
     */
    handleSelect(node, index) {
        const {engineId, onEngineChange} = this.props;
        if (engineId === node.key) {
            this.setState({
                popoverVisible: false
            })
            return;
        }
        if (onEngineChange instanceof Function) {
            onEngineChange(node.key);
        }
        this.setState({
            popoverVisible: false,
            engineIcon: node.props.icon.props.type
        })
    }
    /**
     * 处理按键keyDown事件
     */
    handleKeyDown(e) {
        const {onSearch} = this.props;
        if (e.keyCode === 13 && onSearch instanceof Function) {
            onSearch(e.target.value);
        }
    }
    render() {
        const {engineList, className, theme} = this.props;
        const {engineIcon, popoverVisible} = this.state;
        return (
            <div className={`${styles['search']} ${className ? className : ''} ${theme && theme==='gray' ? styles['gray'] : ''}`}>
                <Popover 
                    placement="bottomLeft"
                    overlayClassName="search-overlay"
                    visible={popoverVisible}
                    align={{
                        offset: [8, 8]
                    }}
                    onSelect={this.handleSelect.bind(this)}
                    overlay={
                        engineList.map(item =>
                            <PopoverItem 
                                key={item.id} 
                                icon={<Iconfont type={item.icon}/>} 
                            >{getLocale() === 'en-US' ? item.englishName : item.chineseName}</PopoverItem> 
                        )
                    }>
                    <div className={styles['selection']}>
                        <Iconfont type={engineIcon}/>
                    </div>
                </Popover>
                <input placeholder={formatMessage({id: 'search_word'})} onKeyDown={this.handleKeyDown.bind(this)}/>
            </div>
        )
    }
}

export default Search;