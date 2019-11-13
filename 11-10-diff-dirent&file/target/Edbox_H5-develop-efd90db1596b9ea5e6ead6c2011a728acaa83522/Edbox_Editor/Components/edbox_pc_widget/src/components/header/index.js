import React, {Component} from 'react';
import IconFont from '@/components/iconfont';
import router from 'umi/router';
import styles from './index.scss';

class Header extends Component {
    
    goBack() {
        router.go(-1);
    }

    /* closeChoose() {
        const close = this.props.close;
        if(close && typeof(close) === 'function'){
            this.props.close();
        }else{
            this.closeWidget();
        }
    } */

    closeWidget() {
        const { Edbox } = window;
        Edbox.Message.Broadcast("Close", []);
    }

    render() {
        const {title, back} = this.props;
        return (
            <div className={styles['header']}>
                {back ? 
                    <IconFont type="icon-arrow-go-back-fill" className={styles['ico-back']} onClick={this.goBack.bind(this)}/>
                    : null
                }
                {title ?
                    <h3 className={styles['tit']}>{this.props.title}</h3>
                    : null
                }
                <IconFont type="icon-close" className={styles['ico-close']} onClick={this.closeWidget.bind(this)}/>
            </div>
        )
    }
}

export default Header;

