import React, { Component } from 'react';
import { Card, Slider } from 'antd-mobile';
import Iconfont from '@/components/Iconfont';
import styles from './index.scss';

class AudioPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlay: false,
            nowTime: 0,
            totalTime:this.timeToSec(props.data.time)
        };
    }
    
    switchPlayStatus = () => {
        this.setState(prevState => ({
            isPlay: !prevState.isPlay,
        }));
    };
    // 时间转秒
    timeToSec = time => {
        let s = '';
        if(time.split(':').length===3){
            const h = time.split(':')[0];
            const min = time.split(':')[1];
            const sec = time.split(':')[2];
            s = Number(h * 3600)+Number(min * 60) + Number(sec);
        }else {
            const min = time.split(':')[0];
            const sec = time.split(':')[1];
            s = Number(min * 60) + Number(sec);
        }

        return s;
    };
    // 秒转时间
    secToTime = time => {
        let newTime, hour, minite, seconds;
        if (time >= 3600) {
            hour = parseInt(time / 3600) < 10 ? '0' + parseInt(time / 3600) : parseInt(time / 3600);
            minite =
                parseInt((time % 60) / 60) < 10
                    ? '0' + parseInt((time % 60) / 60)
                    : parseInt((time % 60) / 60);
            seconds = time % 3600 < 10 ? '0' + (time % 3600) : time % 3600;
            newTime = hour + ':' + minite + ':' + seconds;
        } else if (time >= 60 && time < 3600) {
            minite = parseInt(time / 60) < 10 ? '0' + parseInt(time / 60) : parseInt(time / 60);
            seconds = time % 60 < 10 ? '0' + (time % 60) : time % 60;
            newTime = minite + ':' + seconds;
        } else if (time < 60) {
            seconds = time < 10 ? '0' + time : time;
            newTime = '00:' + seconds;
        }
        return newTime;
    };

    render() {
        const { data } = this.props;
        const { isPlay, nowTime } = this.state;
        return (
            <div className="audioplayer-card-wrap">
                <Card className={styles['audioplayer-card']}>
                    <span className={styles['title']}>{data.name}</span>
                    <Slider defaultValue={0} min={0} max={100} />
                    <i className={styles['time']}>
                        {this.secToTime(nowTime)}/{data.time}
                    </i>
                    <Iconfont
                        type={isPlay ? 'icon-play' : 'icon-pause'}
                        className={styles['btn']}
                        onClick={this.switchPlayStatus}
                    />
                </Card>
            </div>
        );
    }
}

export default AudioPlayer;
