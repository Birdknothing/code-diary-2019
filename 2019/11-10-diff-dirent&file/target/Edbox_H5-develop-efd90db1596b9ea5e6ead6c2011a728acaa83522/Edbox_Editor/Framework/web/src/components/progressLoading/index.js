import React, {Component} from 'react';
import styles from './index.scss';
import logoImg from './image/pc-loading.png';

class ProgressLoading extends Component {

    constructor(props) {
        super(props);

        this.pathInner = "M292.3,51.5c-0.7-1.1-1.6-2.2-2.5-3.4l-0.6-0.7c-1.2-1.3-2.4-2.5-4-3.9l-0.1,0l-0.1,0l-0.4-0.2c-0.6-0.3-1.1-0.6-1.7-0.8c-0.7-0.3-1.5-0.4-2.4-0.4c-1.7,0-3.3,0.9-4.7,2.5c-2.3,2.6-5,5.8-8.1,9.6c-1.4,1.7-2.7,3.4-4.2,5.3c-1.3,1.6-2.6,3.3-4,5c-0.8-2-1.7-4-2.4-5.8c-1-2.4-2-4.8-3-7.3c-0.9-1.9-2-3.4-3.2-4.4c-1.3-1.2-3.1-1.9-5.4-2.3l-0.1,0h-0.1h-0.3c-0.4,0-0.9,0-1.3-0.1c-0.4,0-0.8,0-1.2,0h-2.7h-2.5h-1.3c-0.4,0-0.9,0-1.5,0.1c-2.3,0.4-3.5,1-4.1,2.1c-0.6,1.1-0.5,2.5,0.5,4.9c0.2,0.6,0.5,1.2,0.8,1.8c-0.2-0.1-0.3-0.3-0.5-0.4c-1.9-1.5-4.2-2.7-6.9-3.7c-2.6-1-5.5-1.7-8.5-2.1c-0.8-0.1-1.7-0.2-2.5-0.2c-1.8,0-3.4,0.2-5.1,0.7c-2.6,0.7-4.8,1.8-6.7,3.3c-2.5,2.2-4.9,4.7-7.2,7.8c-2.1,2.9-3.8,6-5.2,9.3c-0.9,2.2-1.7,4.4-2.3,6.7c-0.4-0.3-0.8-0.5-1.2-0.7c-1.8-1-3.7-1.6-5.6-1.9c0.7-1.1,1.4-2.2,2-3.4c0.9-1.7,1.7-3.3,2.5-5c0.7-1.7,1.3-3.5,1.8-5.2c0.4-1.5,0.7-3.2,0.8-5.5c0-1.9-0.2-3.6-0.6-5.4c-0.5-1.8-1.4-3.5-2.5-5.1c-2.1-2.7-4.5-4.9-7.1-6.6c-2.6-1.7-5.4-3-8.3-3.9c-1.5-0.5-3.1-0.7-4.8-0.7c-1,0-2.1,0.1-3.1,0.2c-2.7,0.4-5.4,1.2-8.7,2.6c-2.8,1.2-5.8,2.7-8.9,4.7c-2.6,1.7-5.7,3.8-8.5,6.2c-2.6,2.2-5.1,4.5-7.4,6.8c-1.7,1.8-3,3.3-4.2,4.8c-1.9-1.2-4.1-2.2-6.6-2.9c-2.6-0.8-5.3-1.1-8.4-1.1h-0.8c-3,0.1-6.1,0.5-9.1,1.1c-2.9,0.7-5.7,1.6-8.2,2.7c-2.8,1.2-5,2.3-6.7,3.5L82.9,60l-0.3,0.2v0.4V61l-0.2,11.4c-0.4-0.6-0.8-1.2-1.2-1.8c-1.1-1.7-2.5-3.3-4.1-5c-1.8-1.9-3.5-3-5.4-3.4c-1-0.2-2-0.3-3.3-0.3c-0.9,0-2,0.1-3.1,0.2l-0.3,0c-2.7,0.4-5.5,0.8-8.5,1.2c-1.9,0.3-3.9,0.7-6.1,1.2c-0.1-4-0.2-8-0.4-11.9c-0.2-4.5-0.3-8.3-0.2-11.8c5.1-1.3,10.4-2.5,16.6-3.9c5.6-1.2,10.4-2.3,15.1-3.3l1.3-0.3c3.1-0.8,4.8-1.7,5.6-2.9l0,0l0,0c0.7-1.4,0.5-3.4-0.8-6.3c-1-2-2-4-3-5.9C83.4,16,82,13.9,80.3,12C77.6,8,73.8,6,69,6c-0.6,0-1.4,0-2.1,0.1c-5.7,0.7-11.3,1.7-16.7,3c-4.9,1.1-10.2,2.4-15.9,4.1c-5.1,1.4-10.2,3.1-14.5,4.6c-5.2,1.8-9,3.2-12.4,4.5l-0.6,0.2l-0.6,0.2l0.1,0.6l0.1,0.6l18,87.7c0.6,2.4,1.7,4.4,3.3,6.1c1.4,1.5,3.1,2.7,5.2,3.9l0.9,0.5c2.1,1.1,3.7,1.9,5.1,2.6c1.8,0.9,3.4,1.6,5.1,2.2c1.4,0.6,3.1,1.1,5.5,1.4l0.1,0h0.1c0.1,0,0.3,0,0.4,0c0.2,0,0.4,0.1,0.7,0.1c1.8,0,4-0.5,6.9-1.4c4.7-1.3,9.9-2.9,14.9-4.4c2.7-0.8,5.3-1.6,7.7-2.3c2.6-0.8,5-1.5,7.4-2.2l0.4,0.2l1.4,0.8c1.1,0.6,2.5,1.2,4,1.8c1.7,0.6,3.3,1,4.9,1c1.4,0,2.8-0.3,4.3-0.8c4.9-1.7,9.5-4,13.3-6.6c3.8-2.6,7.2-5.6,9.9-8.7c2.9-3.3,5.1-6.7,6.5-10.1c0.7-1.5,1.2-2.8,1.6-4.1c0.6,1.6,1.2,3.2,1.8,4.8c0.7,1.9,1.4,3.9,2.2,5.9c1.4,3.8,3,7.6,4.9,11.9c0.4,1.1,0.9,2,1.5,2.9c0.6,0.8,1.1,1.3,1.8,1.8c0.6,0.4,1.3,0.8,2.3,1.1c0.3,0.1,0.5,0.2,0.8,0.3c0.5,0.2,1,0.3,1.5,0.6l0.2,0.1h0.2h0.1h0c2.1,0.4,4.1,0.7,5.9,0.9c1,0.1,2.2,0.2,3.4,0.2c0.7,0,1.5,0,2.3-0.1h1.1c0.7,0,1.4,0,2-0.1c0.8-0.1,1.7-0.3,2.5-0.6c0.8-0.3,1.6-0.7,2.4-1.3c0.8-0.6,1.7-1.2,2.6-2c1.6-1.4,3.4-3,5.5-5.1c2.2-2.2,3.9-4,5.4-5.8c1.3-1.4,2.4-2.8,3.3-4.2c0.4,1,0.8,1.8,1.2,2.7c0.8,1.5,2,2.9,3.5,4.2c1.2,1,2.5,1.9,4.2,2.9c1.6,0.9,3.4,1.5,5.9,2.1c2,0.4,4.1,0.7,6.1,0.9l0.3,0c1,0.1,1.9,0.2,2.9,0.2c1.6,0,3.2-0.2,4.9-0.5c2.3-0.5,4.7-1.6,6.9-3.3l0,0l0,0c0.5-0.5,1.1-1,1.5-1.5c0,0.1,0,0.2,0,0.3v0.1l0,0.1c0.1,0.9,0.5,1.7,1.3,2.6c0.6,0.8,1.3,1.5,2.3,2.4l0.2,0.1c0.8,0.7,1.6,1.4,2.6,2.1c1,0.7,1.9,1.3,2.7,1.7c1.2,0.8,2.4,1.2,3.5,1.2c1.4,0,2.7-0.7,3.8-2c1.6-1.8,3.4-4.1,5.2-6.5c0.5-0.6,1-1.2,1.5-1.9c2.2-2.9,4.6-5.9,6.7-8.5c0.7,1.5,1.4,2.9,2.1,4.3c0.6,1.1,1.1,2.2,1.6,3.2c1.6,3.1,2.7,4.9,3.2,5.5c0.9,1.3,2,2.4,3.1,3.3c1.1,0.8,2.5,1.2,4.3,1.5l0.3,0c1.5,0.1,2.9,0.2,4.4,0.2c1.5,0,3-0.1,4.5-0.2c2-0.2,3.1-0.9,3.6-2c0.4-0.7,0.5-1.9-0.6-3.6c-1.6-3.5-3.2-7.3-4.8-11.2l-0.6-1.5c-1.2-2.7-2.4-5.6-3.6-8.5c-0.6-1.5-1.3-3-2-4.6c-0.2-0.5-0.5-1.1-0.7-1.6c3.8-4.4,7.7-8.9,11.7-13.4c1.6-1.8,3.1-3.5,4.5-5.2c2.1-2.5,4.1-4.8,6-6.9c1.2-1.4,1.9-2.8,2.3-4.3l0-0.1l0-0.1C293.9,54.9,293.4,53.2,292.3,51.5z";

        this.paths = [
            new Path2D("M73.6,100.6c-4.2,0.7-8.1,1.4-11.6,2.2c-3.5,0.8-7.2,1.7-11,2.7c-0.1-2.3-0.2-4.7-0.3-7c-0.2-2.4-0.3-4.9-0.5-7.6c4.7-1.5,9.7-2.9,14.9-4.3s10.3-2.8,15.2-4.2c1.6-0.5,2.7-1,3.4-1.5l-0.5,21.7c-1.2-1.1-2.4-1.8-3.7-2.1C77.9,100.2,76,100.2,73.6,100.6z"),

            new Path2D("M116.8,86.4c-0.7,2.6-1.9,5.2-3.5,7.8c-1.6,2.6-3.7,5.2-6.4,7.6s-5.8,4.6-9.6,6.5c0.8-6.4,1.7-12.8,2.6-19.2c0.9-6.3,2-12.8,3.3-19.3c3.2-1.2,5.9-1.5,8.2-0.8c2.3,0.7,3.9,1.8,4.9,3.4s1.5,3.9,1.5,6.9C117.8,81.5,117.5,83.8,116.8,86.4z"),

            new Path2D("M150.6,69c-0.7-2.8-1.3-5.6-1.7-8.3c1.8-2.2,3.6-4.2,5.4-5.7s3.4-2.8,4.9-3.6s2.9-1.3,4-1.5c1.2-0.1,2,0.1,2.6,0.7c0.7,0.8,0.9,2.1,0.8,4s-0.8,4.1-1.9,6.6c-1.1,2.5-2.6,5.3-4.6,8.2s-4.4,5.9-7.4,8.7C152.1,74.8,151.3,71.8,150.6,69z"),

            new Path2D("M173.2,89.7c-0.2,1.5-0.9,3.2-2,5.2c-1.1,1.9-2.6,4-4.4,6.2s-4,4.3-6.5,6.4c-0.7-2.4-1.4-4.7-1.9-7c-0.6-2.3-1.2-4.7-1.9-7.2c1.8-1.8,3.6-3.3,5.3-4.4s3.3-2,4.7-2.5c1.5-0.5,2.7-0.8,3.8-0.7s1.8,0.2,2.4,0.7C173.3,87,173.5,88.2,173.2,89.7z"),

            new Path2D("M220.6,78.7c-0.4,2.8-0.9,5.4-1.6,7.7c-0.8,2.8-1.6,5.5-2.7,7.9c-1,2.4-2.1,4.4-3.3,6.1s-2.3,2.9-3.5,3.7s-2.3,1-3.3,0.7c-1.2-0.3-2-1.3-2.6-2.8s-1-3.4-1.1-5.6s0-4.5,0.3-7s0.8-4.9,1.5-7.3s1.6-4.9,2.8-7.4c1.1-2.6,2.4-4.9,3.6-7c1.3-2.1,2.6-3.7,3.9-5s2.5-1.7,3.5-1.3c1,0.3,1.8,1.3,2.2,3.1c0.5,1.8,0.7,3.9,0.7,6.4C221.2,73.3,221,75.9,220.6,78.7z"),

            new Path2D("M230.5,101.4c2.1-3.8,3.7-7.8,4.9-12.1c1.2-4.2,1.9-8.6,2.2-12.8c0.3-4.3,0.2-8.4-0.4-12c-0.1-0.6-0.3-1.3-0.4-1.9c0.3,0.7,0.7,1.4,1,2.2c1.3,2.8,2.6,5.6,3.9,8.4c1.3,2.7,2.6,5.5,3.9,8.2c-3.9,4.8-7.5,9.6-10.7,14.1c-1.8,2.5-3.4,4.7-4.8,6.8C230.2,102,230.3,101.7,230.5,101.4z")
        ];

        this.state = {
            canvasWidth : 301,
            canvasHeight : 139,
            percent:0,
            test: '',
        }
    }

    componentDidMount() {
        if(Path2D) {
            const type = this.props.type === undefined ? 0 : this.props.type;
            const canvas = type === 0 ? this.refs.canvas0 : this.refs.canvas1;
            this.canvas = canvas;
            canvas.width = this.state.canvasWidth;
            canvas.height = this.state.canvasHeight;
            this.xOffset = 0; // 水平位移
            this.speed = 0.1;  // 偏移速度
            this.ctx = canvas.getContext('2d');

            //绘制LOGO外框
            const pathInner = new Path2D(this.pathInner); 
            this.ctx.clip(pathInner);
            this.draw();
        }

        this.setState({
            percent: this.props.percent,
            text: this.props.text
        })
        
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.percent > 100) return;
        this.setState({
            percent: nextProps.percent
        })
    }

    /**
     * 绘制波浪函数
     * @param {obj} ctx canvas对象
     * @param {int} xOffset 波浪偏移位置
     * @param {int} percent 波浪高度百分比
     * @param {float} waveHeight 波浪高度,数越大越高
     * @param {string} fillColor 波浪颜色值
     */
    drawSin = (ctx, xOffset, percent, waveHeight, fillColor) => {
        const points = [];
        const canvasWidth = this.state.canvasWidth;
        const canvasHeight = this.state.canvasHeight;
        const startX = 0;
        const waveWidth = 0.06; // 波浪宽度,数越小越宽

        //百分比小于10以及大于92时，让百分比的值固定，避免水波效果看不到
        percent = percent < 10 ? 10 : percent;
        percent = percent > 92 && percent <100 ? 92 : percent;
        
        const height = (canvasHeight + waveHeight*2) * (1- percent/100);
        ctx.beginPath();
        for (let x = startX; x < startX + canvasWidth; x += 20 / canvasWidth) {
          const y = waveHeight * Math.sin((startX + x) * waveWidth + xOffset);
          points.push([x, height + y]);
          ctx.lineTo(x, (height - waveHeight) + y);
        }
        ctx.lineTo(canvasWidth, 0);
        ctx.lineTo(startX, 0);
        ctx.lineTo(startX, canvasHeight);
        ctx.fillStyle=fillColor;
        ctx.fill();
    }

    /**
     * 绘制画布所有元素
     */
    draw = () => {
        const canvas = this.canvas;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);

        // 曲线绘制
        this.drawSin(this.ctx, this.xOffset, this.state.percent, 4, "rgba(255,255, 255, 1)");
        this.drawSin(this.ctx, this.xOffset + 15, this.state.percent, 2.5, "rgba(255,255, 255, 0.6)");
        ctx.fillStyle="#363438";
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 2.5;
        
        //绘制LOGO中的黑色区域
        for(let i=0; i<this.paths.length; i++){
            ctx.fill(this.paths[i]);
            ctx.stroke(this.paths[i]);
        }

        this.xOffset += this.speed;
        this.globalId = requestAnimationFrame(this.draw);
    }

    componentWillUnmount(){
        cancelAnimationFrame(this.globalId);
    }


    render() {
        const type = this.props.type === undefined ? 0 : this.props.type;
        return(         
            <div className={`${styles['loading']} ${type === 1 ? styles['transparent_bg'] : null}`}>
                {type === 0 ?
                    <div className={styles['loading_box']}>
                        <div className={styles['loading_content']}>
                            <canvas ref="canvas0"></canvas>
                            <img className={styles['logo']} src={logoImg} alt=""/>
                            <p>{this.state.text}... <span>{this.state.percent}%</span></p>
                        </div> 
                    </div>
                    :
                    <div className={styles['dialog_box']}>  
                        <div className={styles['loading_content']}>
                            <div className={styles['logo_content']}>
                                <canvas ref="canvas1"></canvas>
                                <img className={styles['logo']} src={logoImg} alt=""/>
                            </div>
                            <p className={styles['p1']}>{this.state.text}...<span>{this.state.percent}%</span></p>
                        </div>
                    </div>
                }
                
            </div>
        );
    }
}

export default ProgressLoading;