import React, {Component} from 'react';
import {formatMessage} from 'umi/locale';
import Label from '@/components/label';
import IconButton from '@/components/iconbutton';
import styles from './index.scss';

class FontStyle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: this.props.config
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            config:{
                ...nextProps.config
            }
        })
    }

    //设置字体是否加粗
    handleBold() {
        const {config} = this.state;
        config.bold = !config.bold;
        this.setState({ 
            config: {
                ...config
            }
        });
        this.props.onUpdate(config);
    }

    //设置是否斜体
    handleItalic() {
        const {config} = this.state;
        config.italic = !config.italic;
        this.setState({ 
            config: {
                ...config
            }
        });
        this.props.onUpdate(config);
    }

    //设置是否加下划线
    handleUderline() {
        const {config} = this.state;
        config.underline = !config.underline;
        this.setState({ 
            config: {
                ...config
            }
        });
        this.props.onUpdate(config);
    }

    render() {
        const className = this.props.className ? this.props.className + ' widget' : 'widget';
        
        return (
            <div className={className}>
                <Label name={formatMessage({id: 'style'})}/>
                <div className={styles['body']}>
                    <IconButton 
                        className={ this.state.config.bold ? styles['btn-bold'] +  ' btn-select' : styles['btn-bold']} 
                        onClick={this.handleBold.bind(this)} selected={this.state.config.bold}>B</IconButton>
                    <IconButton 
                        className={ this.state.config.italic ? styles['btn-italic'] +  ' btn-select' : styles['btn-italic']}
                        onClick={this.handleItalic.bind(this)} selected={this.state.config.italic}>I</IconButton>
                    <IconButton 
                        className={this.state.config.underline ? styles['btn-underline'] +  ' btn-select' : styles['btn-underline']}
                        onClick={this.handleUderline.bind(this)} selected={this.state.config.underline}>
                        <span>U</span>
                        <span>__</span>
                    </IconButton>
                </div>
            </div>
        )
    }
}

export default FontStyle;