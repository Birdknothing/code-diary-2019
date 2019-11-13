import React, {Component} from 'react';
import styles from './index.scss';
import PropsTypes from 'prop-types';

class ActionSheet extends Component {
    constructor(props) {
        super(props);
        const {height} = this.props;
        const {designWidth} = window;
        this.state = {
            touchY: 0, // 手指触摸点的Y坐标值
            minHeight: `${(height || 100) / designWidth}rem`, // 默认传入的高度值
            height: `${(height || 100) / designWidth}rem`, // 面板高度
            maxHeight: 0
        }
    }
    /**
     * 处理面板触摸开始事件
     * @param {object} e 事件对象
     */
    handleTouchStart(e) {
        const {drag} = this.props;
        if (!drag) {
            return;
        }
        const touchY = e.touches[0].clientY;
        this.setState({
            touchY
        })
    }
    /**
     * 处理面板触摸拖拽事件
     * @param {object} e 事件对象
     */
    handlerTouchMove(e) {
        const {drag, onDrag} = this.props;
        if (!drag) {
            return;
        }
        const {minHeight, maxHeight} = this.state;
        const touchY = e.touches[0].clientY;
        const prevTouchY = this.state.touchY;
        let height = this.actionSheet.clientHeight; 
        height = height - (touchY - prevTouchY);
        if (height >= maxHeight) {
            height = maxHeight;
        } else if (height < minHeight) {
            height = minHeight
        }
        this.setState({
            height: height,
            touchY
        })
        onDrag(height);
    }
    /**
     * 处理拖拽条点击
     */
    handleDragBarClick() {
        const {drag, onDrag} = this.props;
        const {height, maxHeight, minHeight} = this.state;
        if (!drag) {
            return;
        }
        if (parseInt(height) < maxHeight) {
            this.setState({
                height: maxHeight
            }, () => onDrag(this.state.height))
        } else {
            this.setState({
                height: minHeight
            }, () => onDrag(this.state.height))
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
            }, () => {
                const {drag, onDrag} = this.props;
                if (!drag) {
                    return;
                }
                onDrag(this.actionSheet.clientHeight)
            })
        }
    }
    componentDidMount() {
        const oHeader = document.querySelector('#header');
        // 计算获取实际的面板高度(px)
        this.setState({
            maxHeight: window.innerHeight - (oHeader ? oHeader.clientHeight : 100), 
            minHeight: this.actionSheet.clientHeight
        })    
    }
    render() {
        const {children, className, drag} = this.props;
        const {height} = this.state;
        return (
            <div className={`${styles['action-sheet']} ${className}`} style={{height}} onTouchStart={this.handleTouchStart.bind(this)} onTouchMove={this.handlerTouchMove.bind(this)} ref={actionSheet => this.actionSheet = actionSheet}>
                {
                    drag ?
                    <span className={styles['drag-bar']} onClick={this.handleDragBarClick.bind(this)}></span>
                    : null
                }
                {children}
            </div>
        )
    }
}

ActionSheet.PropsTypes = {
    defaultHeight: PropsTypes.number,
    onDrag: PropsTypes.function
}

export default ActionSheet;