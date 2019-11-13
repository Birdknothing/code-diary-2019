import React, {Component} from 'react';
import {Icon} from 'antd';
import Label from '@/components/label';
import {formatMessage} from 'umi/locale';
import styles from './index.scss';

class FontSymbol extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seletedSymbol: formatMessage({ id: 'symbol_no' }),
            showDropdown: false,
            symbolList: [formatMessage({ id: 'symbol_no' }), "△", "▽", "○", "◇", "□", "☆", "▷", "◁", "▲", "▼", "●", "◆", "■", "★", "▶", "◀", "▸", "►", "▼", "✪", "❁", "❐", "✰", "▀", "〓", "§", "♤", "♂", "✚", "✣", "☺", "◣", "◢", "◤", "◥", "✖", "▧", "♬", "▐", "↑", "↓", "←", "→", "➜", "➤", "⇦", "⇧", "⇨", "⇩"],
            disabled:false
        }
    } 

    componentDidMount() {
        const { symbolValue, disabled } = this.props;
        const isSymbolList = this.isSymbol(symbolValue);
        
        // 如果disabled为true，则设置置灰效果
        if(disabled){
            this.setState({
                disabled
            })
        }

        // 判断对应元素在项目符号列表中，怎设置默认项目符号
        if(isSymbolList) {
            this.setState({
                seletedSymbol: symbolValue
            })
        }
        
        document.addEventListener('click', () => {
            this.setState({ 
                showDropdown: false 
            });
        });
    }

    componentWillReceiveProps(nextProps){
         // 如果disabled为true，则设置置灰效果
         if(nextProps.disabled){
            this.setState({
                disabled: nextProps.disabled
            })
        }

        if(nextProps.symbolValue !== undefined){
            const isSymbolList = this.isSymbol(nextProps.symbolValue);
            if(isSymbolList) {
                this.setState({
                    seletedSymbol: nextProps.symbolValue
                })
            }
        }
        
        // 判断为重制的话，则项目符号置空
        if(nextProps.isRest) {
            this.setState({
                seletedSymbol: formatMessage({ id: 'symbol_no' })
            });
        } 
    }

    // 判断symbolValue是否在项目符号中
    isSymbol(symbol) {
        const { symbolList } = this.state;
        
        // 判断传递过来的symbolValue是否在项目符号中，如果是的话，则该符号为项目符号
        for(let i=0; i<symbolList.length; i++) {
            if(symbol.trim() === symbolList[i].trim()) {
                return true;
            }
        }

        return false;
    }

    /**
     * 处理符号点击事件
     * @param {string} symbol 符号
     */
    handleDropdownClick(symbol, index) {
        const { showDropdown } = this.state;

        this.setState({
            showDropdown: !showDropdown, // 是否显示下拉列表
            seletedSymbol: symbol // 选中的符号
        });

        //当项目符号为无时，更新父组件的对应的值
        if(index === 0) {
            this.props.onUpdate('');
        } else { // 当项目符号不为无时，更新父组件的对应的值
            this.props.onUpdate(symbol);
        }
        
    }
    /**
     * 处理下拉框的点击事件
     */
    handleSelectionClick(e) {

        e.nativeEvent.stopImmediatePropagation();
        const {showDropdown, disabled} = this.state;
        if(disabled) return;

        this.setState({
            showDropdown: !showDropdown
        });
    }

    /**
     * 处理内容变化事件
     * @param {object} e 事件对象
     */
    handleChange(e) {
        const {onChange} = this.props;
        if (typeof onChange === 'function') {
            onChange(e.target.value);
        }  
    }

    
    render() {
        const {seletedSymbol, showDropdown, symbolList, disabled} = this.state;
        const className = this.props.className ? `${this.props.className} widget` : 'widget';
        return (
            <div className={className}>
                <Label name={formatMessage({ id: 'item_symbol' })} />
                <div className={`${styles['symbol-box']} ${disabled ? 'disabled' : '' }`}>
                    <div className={`${showDropdown ? 'ant-select-open ant-select-focused' : ''}`}>
                        <div className={`${styles['selection']} ant-select-selection`} onClick={this.handleSelectionClick.bind(this)}>
                            <input className={styles['selected']} readOnly value={seletedSymbol} />
                            <div className={styles['ico-arrow'] + ' ant-select-arrow'}>
                                <Icon type="down" className="ant-select-arrow-icon" />
                            </div>
                        </div>
                    </div>
                    {
                        showDropdown && symbolList && symbolList.length ? 
                            <ul className={styles['dropdown']}>
                                {
                                    symbolList.map((symbol, index) => 
                                        <li key={index} onClick={this.handleDropdownClick.bind(this, symbol, index)}>{symbol}</li>
                                    )
                                }
                            </ul>
                        : null
                    }
                </div>
            </div>
        );
    }
}

export default FontSymbol;