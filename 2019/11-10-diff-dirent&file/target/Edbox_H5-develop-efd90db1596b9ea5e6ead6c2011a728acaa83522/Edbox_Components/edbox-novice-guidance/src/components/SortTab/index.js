import React, { Component } from 'react';
import styles from './index.scss'

class SortTab extends Component {
    constructor(props){
        super(props)
        this.state = {
            sortDom:'',
            current: props.current,
            border: props.border || 1
        }
    }

    componentWillMount(){
    }

    handleSortSelect = (key) =>{
        this.setState({
            current: key,
        })
        this.props.onChange(key)
    }

    render() {
        const { current, border } = this.state
        const {currentCountByParent} = this.props;

        return (
            <div className={`${styles.sort} ${border === 1 ? '' : styles.noborder}`}>
                <label className={styles.title}>{this.props.title}:</label>

                {typeof(currentCountByParent) === "undefined"?(
                  this.props.tabItem.map((item,i)=>
                    (<span key={item.id} data-key={i} className={`${styles.item} ${current === i ? styles.active : ''}`} onClick={()=>this.handleSortSelect(i)}>{item.name}</span>)
                )
                ):(
                  this.props.tabItem.map((item,i)=>
                    (<span key={item.id} data-key={i} className={`${styles.item} ${currentCountByParent === i ? styles.active : ''}`} onClick={()=>this.handleSortSelect(i)}>{item.name}</span>)
                )
                )}
            </div>
        );
    }
}

export default SortTab;
