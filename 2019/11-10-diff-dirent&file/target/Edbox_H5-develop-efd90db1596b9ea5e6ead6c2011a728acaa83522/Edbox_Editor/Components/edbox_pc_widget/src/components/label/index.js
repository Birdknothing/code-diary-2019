import React, {Component} from 'react';
import styles from './index.scss';

class Label extends Component {
    render() {
        const {inline} = this.props;
        return (
            <label className={`${styles['label']} ${inline ? styles['inline-label'] : ''}`}>{this.props.name}</label>
        )
    }
}

export default Label;