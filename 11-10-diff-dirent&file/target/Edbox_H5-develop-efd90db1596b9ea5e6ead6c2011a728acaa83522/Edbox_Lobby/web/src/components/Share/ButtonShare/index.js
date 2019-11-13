import React, { Component } from 'react';
import { Button, message } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';

@connect(({ lobby, detail }) => ({
    lobby: lobby,
    detail: detail
}))
class ButtonShare extends Component {
    constructor(props){
        super(props)
        this.state = {
            disabled: false
        }
    }
    handleShare = () =>{
        const { id, appId, appName, iconUrl, access, version, dispatch} = this.props
        const reqUrl = access === 2 ? 'detail/getMyWorkPersonalAppInfo':'detail/getDetail'
        dispatch({
            type: reqUrl,
            payload:{
                id:appId
            },
            callback:(data)=>{
                dispatch({
                    type:'lobby/shareApp',
                    payload:{
                        appId: appId,
                        receiver: id,
                        appName: appName,
                        iconUrl: iconUrl,
                        get_type: 2,
                        access: access,
                        version:version,
                        appDesc:data.game_description
                    },
                    callback:(data)=>{
                        if(data.data && data.data.error){
                            message.info(formatMessage({id:'share_failure'}))
                        }else{
                            message.success(formatMessage({id:'share_success'}))
                            this.setState({
                                disabled: true
                            })
                        }
                    }
                })
            }
        })
        
    }
    render() {
        const { disabled } = this.state
        return (
            <Button disabled={disabled} onClick={this.handleShare} type="primary">{formatMessage({id:'mw_share'})}</Button>
        );
    }
}

export default ButtonShare;