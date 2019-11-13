import React, {Component} from 'react';
import router from 'umi/router';
import PropsTypes from 'prop-types';
import {Button} from 'antd-mobile';
import Iconfont from '@/components/Iconfont';
import styles from './index.scss';

class Header extends Component {
    goBack() {
        router.goBack();
    }
    /**
     * 点击确认按钮的回调
     */
    handleConfirm() {
        const {onConfirm} = this.props;
        onConfirm();
    }
    render() {
        const {
            back, // 是否显示返回按钮
            confirmBtn, // 确定按钮包含的内容（react元素），为空时不显示
            confirmTxt, // 确定按钮文本类型，为空时不显示（存在confirmBtn时，则此属性将被忽略）
            title, // 标题
            theme, // 主题（默认为黑色背景，白色背景时传值“white”）
            children, // 子元素（存在title元素时不插入子元素）
            className, // 类名
        } = this.props;

        return (
            <div id="header" className={`${styles['header']} clearfix ${theme === 'white' ? styles['theme-white'] : ''} ${className ? className : ''}`}>
                {
                    back ? 
                    <Iconfont type="icon-arrow-left" className={styles['ico-back']} onClick={this.goBack.bind(this)}/>
                    : null
                }
                {
                    title ?
                    <h2 className="ellipsis">{title}</h2>
                    : 
                        children ?
                        children
                        : null
                }
                {
                    confirmBtn ?
                    <Button type="primary" className={`${styles['btn-confirm']} ${typeof confirmBtn !== 'string' ? styles['icon-btn'] : ''}`} onClick={this.handleConfirm.bind(this)}>
                        {confirmBtn}
                    </Button>
                    : 
                        confirmTxt ?
                        <span className={styles['btn-confirm-txt']} onClick={this.handleConfirm.bind(this)}>{confirmTxt}</span>
                        : null
                }
            </div>
        )
    }
}

Header.PropsTypes = {
    back: PropsTypes.bool,
    confirmTxt: PropsTypes.string,
    confirmBtn: PropsTypes.elementType || PropsTypes.string,
    title: PropsTypes.string,
    className: PropsTypes.string,
    theme: PropsTypes.string,
    onConfirm: PropsTypes.function
}

export default Header;