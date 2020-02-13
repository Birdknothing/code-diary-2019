import React, {Component} from 'react';
import {ActionSheet} from 'antd-mobile';
import {formatMessage} from 'umi/locale';
import router from 'umi/router';

class ImageSelector extends Component {
    constructor(props) {
        super(props);
        //this.showActionSheet();
        //index.scssthis.showActionSheet();
    }
    showLocalImageActionSheet() {
        const opts = [formatMessage({id: 'camera'}), formatMessage({id: 'document'}), formatMessage({id: 'cancel'})];
        ActionSheet.showActionSheetWithOptions({
            options: opts,
            cancelButtonIndex: opts.length - 1,
            destructiveButtonIndex: opts.length - 1,
            title: formatMessage({id: 'select_operation'}),
        },
        (index) => {
            switch(index) {
                case 0:
                    break;
                case 1:
                    break;
                case 2: 
                    this.showActionSheet();
                    break;
                default:
                    break;
            }
        })
    }
    showActionSheet() {
        const opts = [formatMessage({id: 'no_picture'}), formatMessage({id: 'online_picture'}), formatMessage({id: 'local_picture'}), formatMessage({id: 'text_picture'}), formatMessage({id: 'cancel'})];
        ActionSheet.showActionSheetWithOptions({
            options: opts,
            cancelButtonIndex: opts.length - 1,
            destructiveButtonIndex: opts.length - 1,
            title: formatMessage({id: 'restore_to_default_piture'}),
        },
        (index) => {
            switch(index) {
                case 1:
                    router.push('/Edbox_ImageSelector/OnlineImage');
                    break;
                case 2:
                    this.showLocalImageActionSheet();
                    break;
                case 3: 
                    router.push('/Edbox_ImageSelector/TextImage');
                    break;
                default:
                    break;
            }
        })
    }
    render() {
        return (
            <div></div>
        )
    }
}

export default ImageSelector;

