import React, { Component } from 'react';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import SortGridInput from '../SortGridInput'
import styles from './index.scss';


/**
 * @param {array} items 图片列表数据数组
 * @param {int} init 用于标识是否初始化
 * @param {fun} onChange 变化回调
 * @param {fun} onSelect 选择回调
 * @param {boolean} play  是否播放
 * @param {fun} pause 暂停回调
 */
class SortGrid extends Component {
    constructor(props){
        super(props)
        this.state = {
            data: [],
            current: 0,
            dataChange:[],
            isplay: false,
            playStart: 0
        }
    }

    handleUpdata = ({oldIndex, newIndex}) =>{
        const { data, current } = this.state
        // console.log(oldIndex, newIndex)
        if(oldIndex !== newIndex){
            this.props.onChange(arrayMove(data, oldIndex, newIndex),'string')
        }
        if(newIndex !== current){
            this.setState({
                current: newIndex
            })
            this.props.onSelect(newIndex)
        }
        // console.log(arrayMove(data, oldIndex, newIndex))
    }

    handleCurrent = (value) =>{
        const { current } = this.state
        if(value !== current){
            this.setState({
                current: value
            })
            this.props.onSelect(value)
        }
    }

    handleInputUpdata = (value,i) =>{
        const { data } = this.state;
        let origin = [...data]
        origin.splice(i,1,{clip:data[i].clip,time:value})
        this.setState({
            current: i
        })
        this.props.onChange(origin,'array')
    }

    playAni = () =>{
        const { data, current } = this.state;
        const _this = this;
        var aniIndex = current;
        var aniT = data[aniIndex].time;
        this.setState({
            current: aniIndex
        },()=>{
            // console.log('播放序号：',aniIndex)
            // console.log('播放图片：',data[aniIndex].clip)
            this.timerAni = setInterval(fn,aniT*1000)
        })
        function fn(){
            const { isplay } = _this.state;
            clearInterval(_this.timerAni);
            aniIndex++
            if( aniIndex < data.length && isplay){
                aniT = data[aniIndex].time
                // console.log('播放序号：',aniIndex)
                // console.log('播放时间：',aniT)
                // console.log('播放图片：',data[aniIndex].chip)
                _this.setState({
                    current: aniIndex
                })
                _this.timerAni = setInterval(fn,aniT*1000)
            }
            if(aniIndex >= data.length){
                clearInterval(_this.timerAni)
                _this.props.pause()
            }
            if(!isplay){
                clearInterval(_this.timerAni)
                _this.props.pause()
            }


        }
    }
    componentWillUpdate(nextProps, nextState){
        if(nextState.current !== this.state.current){
            this.props.onSelect(nextState.current)
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.items !== this.props.items){
            this.setState({
                data: [...nextProps.items]
            })
            if(this.state.current >= nextProps.items.length && nextProps.items.length !== 0){
                this.setState(prevState=>({
                    current: prevState.current - 1
                }))
            }
            if(nextProps.singleActionCopy !== this.props.singleActionCopy){
                this.setState(prevState=>({
                    current: prevState.current + 1
                }))
            }
        }
        if(nextProps.singleActionNew !== this.props.singleActionNew){
            this.setState({
                current: nextProps.items.length
            })
        }
        if(nextProps.play !== this.props.play){
            if(nextProps.play){
                this.setState({
                    isplay: nextProps.play
                },()=>{
                    this.playAni()
                })
            }else{
                this.setState({
                    isplay: nextProps.play
                },()=>{
                    clearInterval(this.timerAni)
                    this.props.pause()
                })
            }
        }
        if(nextProps.init !== this.props.init){
            this.setState({
                current: 0
            })
        }
    }

    render() {
        const { 
            data,
            current
        } = this.state
        
        const SortableItem = SortableElement(({value}) =>
            <div onClick={()=>this.handleCurrent(value.index)} className={`${styles['grid-item']} ${current === value.index ? styles['selected'] : ''}`} key={`item-${value.index}`}>
                <span className={styles['num']}>{value.index+1}</span>
                <img className={'chip-handle'} src={value.value.clip} alt=""/>
                <SortGridInput
                time={value.value.time}
                onChange={(data)=>this.handleInputUpdata(data,value.index)}
                // focus={()=>this.handleInputFocus(index)}
                />
            </div>
        );
        const SortableList = SortableContainer(({items}) => {
            return (
                <div className={styles['grid']}>
                    {items.map((value, i) => (
                    <SortableItem key={`item-${i}`} index={i} value={{value,index:i}} />
                    ))}
                </div>
            );
        });
        return (
            <div>
                <SortableList 
                axis="xy"
                items={data} 
                distance={10}
                onSortEnd={this.handleUpdata}
                 />
            </div>
        );
    }
}

export default SortGrid;