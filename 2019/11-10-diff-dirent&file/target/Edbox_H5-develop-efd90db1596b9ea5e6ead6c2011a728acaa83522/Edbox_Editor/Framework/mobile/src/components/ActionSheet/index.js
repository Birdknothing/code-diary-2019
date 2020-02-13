import React, {Component} from 'react';
import styles from './index.scss';
import PropsTypes from 'prop-types';

class ActionSheet extends Component {
    constructor(props) {
        super(props);
        const {height} = this.props;
        const {designWidth} = window;
        this.state = {
            height: `${(height || 100) / designWidth}rem` // 面板高度
        }
    }
    /**
     * 属性对象更新前的操作
     * @param {object} nextProps 下次更新的属性对象
     */
    componentWillReceiveProps(nextProps) {
        // 如果父级组件高度变化则立即修改面板的高度值
        if (nextProps.height !== this.props.height) {
            const {designWidth} = window;
            this.setState({
                height: `${nextProps.height / designWidth}rem`
            })
        }
    }
    render() {
        const {children, className} = this.props;
        const {height} = this.state;
        return (
            <div className={`${styles['action-sheet']} ${className}`} style={{height}} ref={actionSheet => this.actionSheet = actionSheet}>
                {children}
            </div>
        )
    }
}

ActionSheet.PropsTypes = {
    defaultHeight: PropsTypes.number
}

export default ActionSheet;