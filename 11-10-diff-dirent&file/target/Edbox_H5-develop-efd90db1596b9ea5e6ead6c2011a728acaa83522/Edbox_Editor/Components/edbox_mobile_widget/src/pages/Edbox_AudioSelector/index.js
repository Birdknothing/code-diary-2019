import React, { Component } from 'react';
//import { formatMessage, getLocale } from 'umi/locale';
//import { Button } from 'antd-mobile';
//import Header from '@/components/Header';
//import AudioPlayer from '@/components/AudioPlayer';
//import AudioSearch from '@/components/AudioSearch';
//import AudioListview from '@/components/AudioListview';
import ActionSheet from '@/components/ActionSheet';
import Iconfont from '@/components/Iconfont';
import Link from 'umi/link';
import styles from './index.scss';

class EditAudio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [
                {
                    id:1,
                    type: 'BGM',
                    title: 'RECHING NEW HEIGHT',
                    status:1,
                },
                {
                    id:2,
                    type: 'BGM2',
                    title: 'RECHING NEW HEIGHT',
                    status:1,
                },
                {
                    id:3,
                    type: 'BGM3',
                    title: 'RECHING NEW HEIGHT',
                    status:0,
                },
                {
                    id:4,
                    type: 'BGM4',
                    title: 'RECHING NEW HEIGHT',
                    status:1,
                },
                {
                    id:5,
                    type: 'BGM5',
                    title: 'RECHING NEW HEIGHT',
                    status:1,
                },
                {
                    id:6,
                    type: 'BGM6',
                    title: 'RECHING NEW HEIGHT',
                    status:1,
                },
                {
                    id:7,
                    type: 'BGM7',
                    title: 'RECHING NEW HEIGHT',
                    status:1,
                },
                {
                  id:8,
                  type: 'BGM8',
                  title: 'RECHING NEW HEIGHTRECHING NEW HEIGHTRECHING NEW HEIGHT',
                  status:1,
              },
            ],
        };
    }

    dealData=(data)=>{
      data = data.map(item=>{
         item.title = item.title.length>20? `${item.title.substring(0,20)}...`:item.title;
         return item;
      })
      const result = [];
      for(let i=0, n=data.length; i<n; i+=2){
        result.push(data.slice(i,i+2))
      }
      return result;
    }

    render() {
        const {listData} = this.state;
        return (
            <div className="page-wrap black">
                <ActionSheet className={styles['audio-action-sheet']} height={560}>
                <div className={styles['top-list-wrap']} onTouchMove={e => e.stopPropagation()}>
                    <ul className={styles['top-list']}>
                        {this.dealData(listData).map((item, index)=>(
                          <li className={styles['card-item']} key={index.toString()}>
                            {item.map(item2=>(
                              <div className={`${styles['item']} ${item2.status ===0? styles['stop']:''}`} key={item2.id}>
                                <Link to="/Edbox_AudioSelector/detail">
                                    <span className={styles['sup']}>{item2.type}</span>
                                    <p className={styles['tit']}>{item2.title}</p>
                                    <span  className={styles['ico']}>
                                    <Iconfont className={styles['icon']} type="icon-pause" />
                                    </span>
                                </Link>
                            </div>
                            ))}
                          </li>
                        ))}
                    </ul>
                    </div>
                    <div className={styles['btm-opr-wrap']} onTouchMove={e => e.stopPropagation()}>
                        <span className={styles['opr-item']}>
                            <Iconfont className={styles['icon']} type="icon-rotate" />
                        </span>
                        <span className={styles['opr-item']}>
                            <Iconfont className={styles['icon']} type="icon-cut" />
                        </span>
                    </div>
                </ActionSheet>
            </div>
        );
    }
}

export default EditAudio;
