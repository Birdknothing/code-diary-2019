import React, { Component } from 'react';
import { getLocale } from 'umi/locale';
import { Button } from 'antd-mobile';
import styles from './index.scss';

// 可折叠的菜单
class AudioFoldTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowTab: false,
            selecetedObj: null,
            isShowFoldBtn: true, // 是否显示切换按钮
        };
    }
    componentDidMount = () => {
      this.adjustBtnFoldShow();
        // this.setState({
        //     isShowFoldBtn: this.adjustBtnFoldShow(),
        // });
    };
    switchShowTab = () => {
        this.setState(
            prevState => ({
                isShowTab: !prevState.isShowTab,
            }),
            () => {
                const { isShowTab } = this.state;
                if (!isShowTab) {
                    const btnsList = document.getElementById('btnsListRef');
                    btnsList.scrollTop = 0;
                }
            },
        );
    };

    chooseItem = item => {
        const { onSelect } = this.props;
        this.setState(prevState => {
            const oldItem = prevState.selecetedObj;
            if ((oldItem && oldItem.id !== item.id) || !oldItem) {
                onSelect(item);
                return {
                    selecetedObj: item,
                };
            }
        });
    };

    getSelectedObj = () => {
        let { selecetedObj } = this.state;
        const { data } = this.props;

        if (data && data.length && !selecetedObj) {
            selecetedObj = data[0];
        }
        return selecetedObj;
    };

    adjustBtnFoldShow = () => {
        const btnsList = document.getElementById('btnsListRef');
        const tabItem = document.querySelectorAll('.border-btn');
        setTimeout(()=>{
          if (btnsList && tabItem&&btnsList.clientHeight&&tabItem.clientHeight) {
            
              if (Math.floor(btnsList.height / tabItem) > 1) {
                  return true;
              } else {
                  return false;
              }
            // this.setState({
            //   isShowFoldBtn: Math.floor(btnsList.height / tabItem) > 1
            // });
          }
        },800);
        
        
        
    };

    render() {
        const { isShowTab } = this.state;
        const { data } = this.props;
        const btnsStyle = isShowTab ? '' : styles['on'];
        const obj = this.getSelectedObj();
        return (
            <div className={`${styles['btns-wrap']} ${btnsStyle}`}>
                <span className={styles['btn-opr']} onClick={this.switchShowTab} />

                <div className={styles['btns-list']} ref={btnList => this.btnList = btnList} id="btnsListRef">
                    {data.map(item => {
                        return (
                            <Button
                                className={styles['border-btn']}
                                key={item.id}
                                type={obj && obj.id === item.id ? 'primary' : 'default'}
                                onClick={() => {
                                    this.chooseItem(item);
                                }}
                            >
                                {getLocale() === 'en-US' ? item.englishName : item.chineseName}
                            </Button>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default AudioFoldTab;
