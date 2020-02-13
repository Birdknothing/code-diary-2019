import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form, Modal, Input, Button, message } from 'antd';

const FormItem = Form.Item;

@connect(({ loading }) => ({
  loading: loading.effects['MyWorks/editGameName'],
  lobbyGetPublishOriginLoading: loading.effects['lobby/getPublishOrigin'],
  lobbyIsNameDuplicateLoading: loading.effects['lobby/isNameDuplicate'],
  lobbyIsSensitiveLoading: loading.effects['lobby/isSensitive']
}))
@Form.create()
// 编辑标题弹窗
// title: 必传，编辑标题
// limitNum: 选传，字数限制
// visible: 必传，控制可见性
// modalCancel: 必传，取消事件
// onSure: 选传，确定之后的回调
class EditTitleModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      id: props.id,
      number: 0,
      isSureBtnUse: true,
      visible: props.visible,
      limitNum: props.limitNum ? props.limitNum : 60,
    };
  }

  componentDidMount() {
    const { title } = this.props;
    this.validateInput(title);
  }

  componentWillMount() {
    clearTimeout(this.closeTimerId);
  }

  modalCancel = () => {
    const { modalCancel } = this.props;
    // 优化关闭有动画
    this.setState(
      {
        visible: false,
      },
      () => {
        this.closeTimerId = setTimeout(() => {
          if (modalCancel) {
            modalCancel();
          }
        }, 500);
      },
    );
  };

  handleInputChange = e => {
    this.validateInput(e.target.value);
    this.setState({
      title: e.target.value,
    });
  };

  validateInput = val => {
    const {
      form: { setFields },
    } = this.props;
    const { limitNum } = this.state;

    if (val) {
      const allLength = val.replace(/[^\x00-\xff]/g, 'aa').length;
      if (allLength > limitNum) {
        setFields({ editTitle: { value: val, errors: [] } });
        this.setState({
          isSureBtnUse: false,
          number: allLength,
        });
      } else {
        setFields({ editTitle: { value: val, errors: null } });
        if (val === '') {
          this.setState({
            isSureBtnUse: false,
            number: 0,
          });
        } else {
          this.setState({
            isSureBtnUse: true,
            number: allLength,
          });
        }
      }
    } else {
      this.setState({
        isSureBtnUse: false,
        number: 0,
      });
    }
  };

  checkNameDuplicate=(id,name,cb)=>{
    const {dispatch,form:{setFields}} = this.props;

    dispatch({
      type:'lobby/getPublishOrigin',
      payload:{
        id,
      },
      callback:res=>{
        if(res.error) {
          message.error(res.error);
        }else{
         let releaseMode = res.data.isNew? 1:2;
         dispatch({
           type:'lobby/isNameDuplicate',
           payload:{
             id,
             releaseMode,
             appName: name,
             accessType:2,
           },
           callback: checkRes=>{
              if(checkRes.is_duplicate === 0){
                // 不重名
                setFields({ editTitle: { value: name, errors: [] } });
                this.setState({
                  isSureBtnUse: true,
                },()=>{
                  if(cb){cb()}
                });

              }else{
                // 重名
                setFields({ editTitle: { value: name, errors: [new Error(formatMessage({id:'lobby_is_name_duplicate'}))] } });
                this.setState({
                  isSureBtnUse: false,
                });
              }
           }

         });
        }
      }
    });
  }

  handleSure = () => {
    const { dispatch,onSure,form:{setFields} } = this.props;
    const { title, id } = this.state;

    // 非法字符检测
    const reg = /[\u2572|\u002a|\u201c|\u201d|\<|\>|\u007c|\u005c|\u002f|\u003a|\u003f|\u0022|\u003c|\u003e|\u005d|\u005b]/g;
    if(title){
      if(reg.test(title)){
        const setArr = Array.from(new Set(title.match(reg)));
        let errHtml = '';
        errHtml = '“' + setArr[0] + '”';
        setFields({ editTitle: { value: title, errors: [new Error(formatMessage({id:'publish_addtag_error'}) + errHtml)] } });
      }else{
        // 必须先验证敏感词和查重
    dispatch({
      type:'lobby/isSensitive',
      payload: {
        word: title,
      },
      callback:res=>{
        if(res.error){
          message.error(res.error);
        }else{
          if(res.is_sensitive) {
            setFields({ editTitle: { value: title, errors: [new Error(formatMessage({id:'lobby_has_sensitive'}))] } });
            this.setState({
              isSureBtnUse: false,
            });
          }else{
            setFields({ editTitle: { value: title, errors: [] } });
            this.setState({
              isSureBtnUse: true,
            });
            // 查重(获取类型-查重)
            this.checkNameDuplicate(id,title,()=>{
              // 修改名字
              dispatch({
                type:'MyWorks/editGameName',
                payload:{
                  id,
                  name: title,
                },
                callback:res=>{
                  if(res) {
                    this.modalCancel();
                    message.success(formatMessage({id:'mw_edit_name_success'}));
                    // 调用父组件获取新的列表
                    if(onSure){onSure();}
                  }
                }
              });
            });
          }
        }
      }
    });
      }
    }





  };
  render() {
    const { title, visible, number, isSureBtnUse, limitNum } = this.state;
    const {
      form: { getFieldDecorator },
      loading,
      lobbyGetPublishOriginLoading,
      lobbyIsNameDuplicateLoading,
      lobbyIsSensitiveLoading
    } = this.props;
    return (
      <Modal
        title={formatMessage({id:'mw_edit_name_title'})}
        visible={visible}
        centered
        onCancel={this.modalCancel}
        footer={[
          <Button onClick={this.modalCancel} key="cancel">
           {formatMessage({id:'cancel'})}
          </Button>,
          <Button
            loading={loading||lobbyGetPublishOriginLoading||lobbyIsNameDuplicateLoading||lobbyIsSensitiveLoading}
            disabled={!isSureBtnUse}
            type="primary"
            onClick={this.handleSure}
            key="ok"
          >
            {formatMessage({id:'mw_edit_name_confirm'})}
          </Button>,
        ]}
      >
        <div style={{ position: 'relative',height:'40px' }}>
          <FormItem style={{ width: '425px',marginBottom:'0' }}>
            {getFieldDecorator('editTitle', {
              initialValue: title ? title : undefined,
            })(<Input allowClear onChange={e => this.handleInputChange(e)} placeholder={formatMessage({id:'publish_placeholder_name'})} />)}
          </FormItem>
          <span
            style={{
              position: 'absolute',
              bottom: '9px',
              right: '-2px',
              fontSize: '14px',
              color: '#999',
              textAlign: 'right',
            }}
          >
            <span style={number > limitNum ? { color: 'red', 'font-style': 'normal' } : {}}>
              {number}
            </span>
            /{limitNum}
          </span>
        </div>
      </Modal>
    );
  }
}

export default EditTitleModal;
