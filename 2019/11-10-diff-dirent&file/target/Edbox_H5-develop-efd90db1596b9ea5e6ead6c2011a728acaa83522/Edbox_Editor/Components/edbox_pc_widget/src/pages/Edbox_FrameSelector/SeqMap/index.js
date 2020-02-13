import React, { Component } from 'react';
import { Row, Col, Radio, Input, Button, Spin, message } from 'antd';
import { formatMessage } from 'umi/locale'
import styles from './index.scss';

const { Edbox } = window;
class SeqMap extends Component {
    constructor(props){
        super(props)
        this.state = {
            radioValue: 1,
            numHor: 1,
            numVer: 1,
            pxHor: 30,
            pxVer: 30,
            img:{
                width: 0,
                height: 0,
                ratio: 1 //源图片比例
            },
            imgCanvas:{
                width: 0,
                height: 0
            },
            canvasWidth: 700,
            canvasHeight: 670,
            cut:[],
            cutIndex: 0,
            imgURL:'',
            isCutting: false,
            GUID: '',
            cutPxArray:[]
        }
    }

    componentWillMount(){
        this.getInitData();
    }

    /**
     *获取初始化信息
     */
    getInitData = () =>{
        const _this = this;
        Edbox.Start();
        Edbox.Message.AddMessageHandler('Init', datas => {
            _this.setState({
                imgURL: datas[2],
                GUID: datas[0]
            })
        });
    }

    handleImageLoaded = () =>{
        const imgDom = this.refs.originImg
        this.setState({
            img:{
                width: imgDom.width,
                height: imgDom.height,
                ratio: imgDom.width/imgDom.height
            }
        },()=>{
            this.init()
        })

    }

    /**
     * 初始化canvas,设置canvas画布大小、设置网格canvas大小
     */
    init = () =>{
        const { img } = this.state
        const canvas = this.refs.canvas0;
        const canvas1 = this.refs.canvas1;
        this.canvas = canvas
        this.canvas1 = canvas1

        canvas.width = img.width + 100
        canvas.height = img.height + 100
        canvas1.width = img.width + 100
        canvas1.height = img.height + 100

        this.ctx = canvas.getContext('2d');
        this.ctx1 = canvas1.getContext('2d');

        let drawWidth = img.width;
        let drawHeight = img.height;
        
        // 判断源图片是否大于画布
        // if(img.ratio > 1){ //横图
        //     if(img.width > canvas.width){
        //         drawWidth = canvas.width
        //         drawHeight = canvas.width / img.ratio
        //     }
        // }else{ //竖图
        //     if(drawHeight > canvas.height){
        //         drawHeight = canvas.height
        //         drawWidth = canvas.height / img.ratio
        //     }
        // }
        this.ctx.drawImage(this.refs.originImg,0,0,Math.round(drawWidth),Math.round(drawHeight))
        this.setState({
            imgCanvas:{
                width: Math.round(drawWidth),
                height: Math.round(drawHeight)
            }
        },()=>{
            this.drawGrip('#cf0100',Math.round(drawWidth)/1,Math.round(drawHeight)/1)
        })
    }

    /**
     * 绘制网格
     * @param {string} color 网格颜色
     * @param {int} stepx 单个网格宽度
     * @param {int} stepy 单个网格高度
     */
    drawGrip = (color,stepx,stepy) =>{
        const { imgCanvas } = this.state
        const ctx1 = this.ctx1
        const canvas1 = this.canvas1
        ctx1.clearRect(0,0,canvas1.width,canvas1.height)
        ctx1.lineWidth = 1;
        ctx1.strokeStyle = color;
        ctx1.strokeRect(0,0,imgCanvas.width,imgCanvas.height);
        for(let x = stepx; x < imgCanvas.width; x+= stepx){
            ctx1.beginPath();
            ctx1.moveTo(x,0);
            ctx1.lineTo(x,imgCanvas.height);
            ctx1.stroke()
        }
        
        for(let y = stepy; y < imgCanvas.height; y+= stepy){
            ctx1.beginPath();
            ctx1.moveTo(0,y);
            ctx1.lineTo(imgCanvas.width,y);
            ctx1.stroke()
        }

        for(let o = 0; o < imgCanvas.height; o = Math.round((o + stepy) * 100) /100){
            for(let p = 0; p < imgCanvas.width; p = Math.round((p + stepx) * 100) /100){
                ctx1.fillStyle = '#cf0100';
                ctx1.fillRect(p,o,20,20)
                ctx1.fillStyle = '#fff';
                ctx1.textAlign = 'center';
                ctx1.font = '14px STheiti, SimHei';
                let index = Math.round((p/stepx + 1) + ((o/stepy) * imgCanvas.width/stepx))
                ctx1.fillText(index,p + 10,o + 15)
                if((o >= (imgCanvas.height - stepy)) && (p >= (imgCanvas.width -stepx))){
                    this.setState({
                        cutIndex: index
                    })
                }
            }
        }

        // this.loopImage(numHor,numVer,0)
    }

    /**
     * 划分序列图
     * @param {int} numX 宽度
     * @param {int} numY 长度 
     * @param {int} type 划分类型 0：均匀分隔 1：像素分隔
     */
    loopImage = (numX,numY,type) =>{
        const { img } = this.state
        this.setState({
            cut: [],
            cutPxArray:[]
        },()=>{
            if(type === 0){
                for(let y = 0; y<numY;y++){
                    for(let x = 0; x < numX; x++){
                        // this.cropImage(
                        //     this.canvas,
                        //     x*img.width/numX,
                        //     y*img.height/numY,
                        //     img.width/numX,
                        //     img.height/numY
                        // )

                        this.setState(prevState=>({
                            cutPxArray: prevState.cutPxArray.concat({
                                x:x*img.width/numX,
                                y:y*img.height/numY,
                                width:img.width/numX,
                                height:img.height/numY
                            })
                        }))
                    }
                }
            }else{
                for(let y = 0; y<img.height;y+=numY){
                    for(let x = 0; x < img.width; x+=numX){
                        // this.cropImage(
                        //     this.canvas,
                        //     x,
                        //     y,
                        //     numX,
                        //     numY
                        // )
                        this.setState(prevState=>({
                            cutPxArray: prevState.cutPxArray.concat({
                                x:x,
                                y:y,
                                width:numX,
                                height:numY
                            })
                        }))
                    }
                }
            }
        })
    }

    componentDidUpdate(prevProps, prevState){
        const { cutIndex, cutPxArray, cut } = this.state
        if(cutIndex === cutPxArray.length && prevState.cutPxArray !== cutPxArray.length && cutPxArray.length !== 0){
            if(cut.length === 0){
                this.cropImage(this.canvas,[])
                // console.log(cutPxArray)
            }
        }
    }

    /**
     * 切割图片
     * @param {obj} targetCanvas canvas对象
     * @param {int} x 切割起点横坐标
     * @param {int} y 切割起点纵坐标
     * @param {int} width 切割宽度
     * @param {int} height 切割高度
     */
    cropImage = (targetCanvas,dataArr) =>{
        const { cutIndex, cutPxArray } = this.state;
        let imgDataArray = [...dataArr]
        let index = imgDataArray.length;
        // console.log(imgDataArray)
        if(cutIndex === index){
            this.setState({
                cut: imgDataArray
            },()=>{
                this.handleSend()
            })
            return
        }
        const { x, y, width, height } = cutPxArray[index];

        const targetctx = targetCanvas.getContext('2d');
        const targetctxImageData = targetctx.getImageData(x,y,width,height);
        const c = document.createElement('canvas');
        const ctx = c.getContext('2d');
        c.width = width;
        c.height = height;
        ctx.rect(0,0,width,height);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.putImageData(targetctxImageData,0,0);
        // if (!HTMLCanvasElement.prototype.toBlob) { //不兼容blob时使用 base64
            imgDataArray = imgDataArray.concat({
                clip: c.toDataURL(),
                time: 0.01
            })

            this.cropImage(this.canvas,imgDataArray)

            // this.setState(prevState => ({
            //     cut: [
            //         ...prevState.cut,
            //         {
            //             chip: c.toDataURL(),
            //             time: 0.05
            //         }
            //     ]
            // }),()=>{
            //     // if(cutIndex === this.state.cut.length){
            //     //     this.handleSend()
            //     // }
                
            //     this.cropImage(this.canvas)
            // })
        // }else{
        //     c.toBlob((blob)=>{
        //         this.setState(prevState=>({
        //             cut:[
        //                 ...prevState.cut,
        //                 {
        //                     chip: URL.createObjectURL(blob),
        //                     time: 0.05
        //                 }
        //             ]
        //         }),()=>{
        //             this.cropImage(this.canvas)
        //         })
        //     })
            
        // }
        
    }

    handleCut = () =>{
        const { radioValue, numHor, numVer, pxHor, pxVer, cutIndex } = this.state
        if(cutIndex > 100){
            message.info(formatMessage({id:"max_chip"}))
            return
        }
        this.setState({
            isCutting: true
        },()=>{
            this.timerCutting = setTimeout(()=>{
                if(radioValue === 1){
                    this.loopImage(numHor,numVer,0)
                }else{
                    this.loopImage(pxHor,pxVer,1)
                }
            },500)
        })
        
    }

    handleSend = () =>{
        const { cut, GUID } = this.state
        // Edbox.Message.Get(window, com => {
        //     com.Start();
        //     Edbox.Message.Broadcast('chipping', cut);
        // });
        Edbox.Message.Broadcast("ToolWindowCallback",[GUID,'CutFrameAnimation',cut]);
    }

    onChangeRadio = e =>{
        this.setState({
            radioValue: e.target.value,
        },()=>{
            const { numHor, numVer, imgCanvas, pxHor, pxVer } = this.state
            if(e.target.value === 1){
                this.drawGrip('#cf0100',imgCanvas.width/numHor,imgCanvas.height/numVer)
            }else{
                this.drawGrip('#cf0100',pxHor,pxVer)
            }
        });
    }
    
    handleInput = (e, targetAttrStr) => {
        const { value } = e.target
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if ((!Number.isNaN(value) && reg.test(value)) || value === '') {
            this.setState({
              [targetAttrStr]: value === '' ? value : parseInt(value),
            });
        }
    };

    handleInputBlur = (targetAttrStr) => {
        const value = this.state[targetAttrStr]
        if(value < 1){
            this.setState({
                [targetAttrStr]: 1
            },()=>{
                const { numHor, numVer, imgCanvas } = this.state
                this.drawGrip('#cf0100',imgCanvas.width/numHor,imgCanvas.height/numVer)
            })
        }else if(value > 10){
            this.setState({
                [targetAttrStr]: 10
            },()=>{
                const { numHor, numVer, imgCanvas } = this.state
                this.drawGrip('#cf0100',imgCanvas.width/numHor,imgCanvas.height/numVer)
            })
        }else{
            const { numHor, numVer, imgCanvas } = this.state
            this.drawGrip('#cf0100',imgCanvas.width/numHor,imgCanvas.height/numVer)
        }

    };
    
    handleInputPx = (e, targetAttrStr) => {
        const { value } = e.target
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if ((!Number.isNaN(value) && reg.test(value)) || value === '') {
            this.setState({
              [targetAttrStr]: value === '' ? value : parseInt(value),
            });
        }
    };

    handleInputBlurPx = (targetAttrStr) => {
        const value = this.state[targetAttrStr]
        const { imgCanvas } = this.state
        if(value < 30){
            this.setState({
                [targetAttrStr]: 30
            },()=>{
                const { pxHor, pxVer } = this.state
                this.drawGrip('#cf0100',pxHor,pxVer)
            })
        }else if(value > (targetAttrStr === 'pxHor' ? imgCanvas.width : imgCanvas.height)){
            this.setState({
                [targetAttrStr]: targetAttrStr === 'pxHor' ? imgCanvas.width : imgCanvas.height,
            },()=>{
                const { pxHor, pxVer } = this.state
                this.drawGrip('#cf0100',pxHor,pxVer)
            })
        }else{
            const { pxHor, pxVer } = this.state
            this.drawGrip('#cf0100',pxHor,pxVer)
        }

    };

    render() {
        const { imgURL } = this.state
        const { 
            radioValue,
            numHor,
            numVer,
            pxHor,
            pxVer,
            isCutting
        } = this.state
        const radioStyle = {
          display: 'block',
          height: '30px',
          lineHeight: '30px',
          marginBottom: '16px'
        };
        return (
            <Row span={24} className={styles['main']}>
                <Spin spinning={isCutting}>
                <Row>
                    <div className={styles['left']}>
                        <canvas ref='canvas0' className={styles['cut']}></canvas>
                        <canvas ref='canvas1' className={styles['grid']}></canvas>
                        <img 
                            ref='originImg'
                            src={imgURL}
                            alt=""
                            style={{visibility: 'hidden',position:'absolute',top:0,left:0}}
                            onLoad={this.handleImageLoaded}
                        />
                    </div>
                    <Col className={styles['right']} span={8}>
                        <h2>{formatMessage({id:'divided'})}</h2>
                        <div className={styles['setting']}>
                            <h3>{formatMessage({id:'horizontal_division'})}</h3>
                            <Col>
                            <Radio.Group onChange={this.onChangeRadio} value={radioValue}>
                                <Radio style={radioStyle} value={1}>
                                <Input 
                                className={styles['radio-input']}
                                value={numHor}
                                maxLength={2}
                                onChange={(e)=>this.handleInput(e,'numHor')}
                                onBlur={()=>this.handleInputBlur('numHor')}
                                disabled={radioValue === 1 ? false : true}
                                style={{ width: 50, marginLeft: 10, marginRight: 10 }} />
                                <span className={styles['radio-tips']}>{formatMessage({id:'horizontal_tips'})}</span>
                                </Radio>
                                <Radio style={radioStyle} value={2}>
                                <Input 
                                className={styles['radio-input']}
                                value={pxHor}
                                onChange={(e)=>this.handleInputPx(e,'pxHor')}
                                onBlur={()=>this.handleInputBlurPx('pxHor')}
                                disabled={radioValue === 2 ? false : true}
                                style={{ width: 50, marginLeft: 10, marginRight: 10 }} />
                                <span className={styles['radio-tips']}>{formatMessage({id:'pixiv_tips'})}</span>
                                </Radio>
                            </Radio.Group>
                            </Col>
                        </div>
                        <div className={styles['setting']}>
                            <h3>{formatMessage({id:'Vertically_division'})}</h3>
                            <Col>
                            <Radio.Group onChange={this.onChangeRadio} value={radioValue}>
                                <Radio style={radioStyle} value={1}>
                                <Input 
                                className={styles['radio-input']}
                                value={numVer}
                                maxLength={2}
                                onChange={(e)=>this.handleInput(e,'numVer')}
                                onBlur={()=>this.handleInputBlur('numVer')}
                                disabled={radioValue === 1 ? false : true}
                                style={{ width: 50, marginLeft: 10, marginRight: 10 }} />
                                <span className={styles['radio-tips']}>{formatMessage({id:'Vertically_tips'})}</span>
                                </Radio>
                                <Radio style={radioStyle} value={2}>
                                <Input 
                                className={styles['radio-input']}
                                value={pxVer}
                                onChange={(e)=>this.handleInputPx(e,'pxVer')}
                                onBlur={()=>this.handleInputBlurPx('pxVer')}
                                disabled={radioValue === 2 ? false : true}
                                style={{ width: 50, marginLeft: 10, marginRight: 10 }} />
                                <span className={styles['radio-tips']}>{formatMessage({id:'pixiv_tips'})}</span>
                                </Radio>
                            </Radio.Group>
                            </Col>
                        </div>
                        <div className={styles['btn-cut']}>
                        <Button 
                        onClick={this.handleCut} 
                        type="primary">{formatMessage({id:'confirm'})}</Button>
                        </div>
                    </Col>
                </Row>
                </Spin>
            </Row>
        );
    }
}

export default SeqMap;