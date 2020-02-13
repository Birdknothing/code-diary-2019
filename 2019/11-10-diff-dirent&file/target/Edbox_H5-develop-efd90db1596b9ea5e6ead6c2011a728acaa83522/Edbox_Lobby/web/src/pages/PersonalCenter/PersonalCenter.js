import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form, Input, Button, DatePicker, Radio, message } from 'antd';
import moment from 'moment';
import styles from './PersonalCenter.scss';
import defaultAvatar from '@/assets/personalcenter/avatar_default.jpg';

import PageLoading from '@/components/PageLoading';
import NormalTipModal from '@/components/NormalTipModal';
import Avatar from './components/Avatar';

const FormItem = Form.Item;
const { Group } = Radio;
const { Edbox } = window;
@connect(({ loading, lobby }) => ({
  loading: loading.models.personalCenter,
  getInfoLoading: loading.effects['personalCenter/getPersonalInfo'],
  saveNameLoading: loading.effects['personalCenter/saveName'],
  saveBirthdayLoading: loading.effects['personalCenter/saveBirthday'],
  saveSexLoading: loading.effects['personalCenter/saveSex'],
  validateEmailLoading: loading.effects['personalCenter/validateEmail'],
  lobby,
}))
@Form.create()
class PersonalCenter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      sexData: [
        {
          name: formatMessage({ id: 'pc_sex_male' }),
          code: 1,
        },
        {
          name: formatMessage({ id: 'pc_sex_female' }),
          code: 2,
        },
      ], // 性别数据
      initObj: {
        // 实际真实对象
        avatarUrl: '',
        name: '',
        birthday: '',
        sex: '',
        parentsMailbox: '',
      },
      editStatus: {
        // 编辑状态
        name: false,
        birthday: false,
        sex: false,
        parentsMailbox: false,
      },
      isVerifiedParentMailbox: false,
      editObj: {}, // 编辑对象
      tipVisible: false, // 控制邮箱验证提示显隐
      tip: '', // 邮箱验证提示文本
      isMailboxCanVerify: false,
      isSendedVeify: false,
      isNameCanSave: true,
    };
  }

  componentDidMount() {
    this.initData();
  }

  // 初始化数据
  initData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'personalCenter/getPersonalInfo',
      callback: data => {
        this.setState(
          prevState => {
            const oldEditObj = prevState.editObj ? prevState.editObj : data;
            // console.log('个人中心返回的用户数据：',data);
            return {
              initObj: {
                ...prevState.initObj,
                ...data,
                sex: data.sex ? data.sex : 1,
                birthday: data.birthday
                  ? data.birthday
                  : moment(new Date())
                      .add('year', 0)
                      .format('YYYY-MM-DD'),
              },
              editObj: {
                ...prevState.initObj,
                ...oldEditObj,
                sex: oldEditObj.sex ? oldEditObj.sex : 1,
                birthday: oldEditObj.birthday
                  ? oldEditObj.birthday
                  : moment(new Date())
                      .add('year', 0)
                      .format('YYYY-MM-DD'),
              },
            };
          },
          () => {
            if (!data.parentsMailbox) {
              this.changeEditStatus('parentsMailbox', true);
            }
          },
        );
        // 更新大厅头像
        dispatch({
          type: 'lobby/setUserInfo',
          payload: {
            userInfo: {
              avatarUrl: data.avatarUrl,
            },
          },
        });
        // 更新大厅名字
        dispatch({
          type: 'lobby/setUserInfo',
          payload: {
            userInfo: {
              name: data.name,
            },
          },
        });
      },
    });

  };

  // 原理： 利用canvas.toDataURL的API转化成base64
  urlToBase64 = url => {
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.onload = function() {
        let canvas = document.createElement('canvas');
        canvas.width = this.naturalWidth;
        canvas.height = this.naturalHeight;
        // 将图片插入画布并开始绘制
        canvas.getContext('2d').drawImage(image, 0, 0);
        // result
        let result = canvas.toDataURL('image/png');
        resolve(result);
      };
      // CORS 策略，会存在跨域问题https://stackoverflow.com/questions/20424279/canvas-todataurl-securityerror
      image.setAttribute('crossOrigin', 'Anonymous');
      image.src = url;
      // 图片加载失败的错误处理
      image.onerror = () => {
        reject(new Error('图片流异常'));
      };
    });
  };

  // 原理：利用URL.createObjectURL为blob对象创建临时的URL
  base64ToBlob({ b64data = '', contentType = '', sliceSize = 512 } = {}) {
    return new Promise((resolve, reject) => {
      // 使用 atob() 方法将数据解码
      let byteCharacters = atob(b64data);
      let byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);
        let byteNumbers = [];
        for (let i = 0; i < slice.length; i++) {
          byteNumbers.push(slice.charCodeAt(i));
        }
        // 8 位无符号整数值的类型化数组。内容将初始化为 0。
        // 如果无法分配请求数目的字节，则将引发异常。
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      let result = new Blob(byteArrays, {
        type: contentType,
      });
      result = Object.assign(result, {
        // jartto: 这里一定要处理一下 URL.createObjectURL
        preview: URL.createObjectURL(result),
        name: `头像图片`,
      });
      resolve(result);
    });
  }

  // 更新头像
  updateAvatarUrl = avatarUrl => {
    // console.log('更新的头像：',avatarUrl);
    avatarUrl = avatarUrl ? avatarUrl : defaultAvatar; // 没有图用默认图
    this.setState(
      prevState => ({
        initObj: {
          ...prevState.initObj,
          avatarUrl,
        },
      }),
      () => {
        this.urlToBase64(avatarUrl).then(res => {
          // console.log('base64', res)
          let base64 = res.split(',')[1];
          let imgType = 'image/png';
          if (avatarUrl.indexOf('.jpg') > -1 || avatarUrl.indexOf('.jpeg') > -1) {
            imgType = 'image/jpeg';
          } else if (avatarUrl.indexOf('.png') > -1) {
            imgType = 'image/png';
          } else if (avatarUrl.indexOf('.gif') > -1) {
            imgType = 'image/gif';
          }
          this.base64ToBlob({ b64data: base64, contentType: imgType }).then(resBlob => {
            // 转后后的blob对象
            this.setState(
              prevState => ({
                initObj: {
                  ...prevState.initObj,
                  avatarBlob: resBlob,
                },
              }),
              () => {
                this.saveItem('avatarBlob');
              },
            );
          });
        });
      },
    );
  };

  // 改变编辑状态
  changeEditObj = (targetAttr, val) => {
    this.setState(
      prevState => ({
        editObj: {
          ...prevState.editObj,
          [targetAttr]: val,
        },
      }),
      () => {
        // const { editObj } = this.state;
        // console.log('编辑数据：', editObj);

        if (targetAttr === 'parentsMailbox') {
          this.validateEmail();
        }
        // 中英文字符数控制（双字节）
        if (targetAttr === 'name') {
          this.validateWordNum(val, 30, 'name', formatMessage({ id: 'pc_tip_less_30' }));
        }
      },
    );
  };

  // 验证邮箱是否可以验证
  validateEmail = () => {
    const {
      form: { getFieldError, getFieldValue },
    } = this.props;
    // 格式错误不能验证
    if (getFieldError('parentsMailbox') && getFieldError('parentsMailbox').length) {
      this.setState({
        isMailboxCanVerify: false,
      });
    } else {
      const value = getFieldValue('parentsMailbox');
      // 空值不能验证
      if (value) {
        this.setState({
          isMailboxCanVerify: true,
        });
      } else {
        this.setState({
          isMailboxCanVerify: false,
        });
      }
    }
  };

  // 表单项改变(根据事件对象传值)
  handleFormItemChange = (targetAttr, e) => {
    this.changeEditObj(targetAttr, e.target.value);
  };

  // 日期改变
  handleDateChange = (date, dateString, attrStr) => {
    this.changeEditObj(attrStr, dateString);
  };

  saveItem = (attrStr,type) => {
    const { dispatch } = this.props;
    const { initObj } = this.state;
    let url = 'personalCenter/saveName';
    switch (attrStr) {
      case 'name':
        url = 'personalCenter/saveName';
        break;
      case 'birthday':
        url = 'personalCenter/saveBirthday';
        break;
      case 'sex':
        url = 'personalCenter/saveSex';
        break;
      case 'avatarBlob':
        url = 'personalCenter/saveAvatarUrl';
        break;
      default:
        break;
    }
    const defalutEmpty = {
      avatarBlob: '',
      birthday: '',
      name: '',
      sex: 0,
    };
    dispatch({
      type: url,
      payload: {
        ...defalutEmpty,
        [attrStr]: initObj[attrStr],
      },
      callback: res => {
        if (res) {
          message.success(formatMessage({ id: 'pc_save_success' }));
          this.initData();
        }
      },
    });
    if(type && type === 'save'){
      this.changeEditStatus(attrStr, false, 'save');
    }else{
      this.changeEditStatus(attrStr, false);
    }
  };

  isSensitive = (word, cb) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lobby/isSensitive',
      payload: {
        word,
      },
      callback: res => {
        if (cb) {
          cb(res);
        }
      },
    });
  };

  // 保存每一个表单项
  modifyItem = (attrStr, cb) => {
    const { editObj } = this.state;

    this.setState(
      prevState => ({
        initObj: {
          ...prevState.initObj,
          [attrStr]: editObj[attrStr],
        },
      }),
      () => {
        // 保存接口调用
        // 改变编辑状态
        // const { initObj } = this.state;
        // console.log('真实数据：', initObj);
        if (cb) {
          cb();
        }
        // 保存数据
        const {
          form: { getFieldError },
        } = this.props;
        if (attrStr && attrStr !== 'parentsMailbox') {
          const errorArr = getFieldError(attrStr);
          if (!errorArr || !errorArr.length) {
            // 名字敏感检测
            if (attrStr === 'name') {
              const { initObj } = this.state;
              const {
                form: { setFields },
              } = this.props;

              this.isSensitive(initObj.name, isSensitiveData => {
                if (isSensitiveData.is_sensitive) {
                  setFields({
                    name: {
                      value: initObj.name,
                      errors: [new Error(formatMessage({ id: 'lobby_has_sensitive' }))],
                    },
                  });
                } else {
                  this.saveItem(attrStr,'save');
                  Edbox.DataStatistic.ClickEvent('SaveNickName','Profile','')
                }
              });
            } else {
              this.saveItem(attrStr,'save');
              if(attrStr === 'birthday'){
                Edbox.DataStatistic.ClickEvent('SaveBirth','Profile','')
              }
              if(attrStr === 'sex'){
                Edbox.DataStatistic.ClickEvent('SaveSex','Profile','')
              }
            }
          }
        }
      },
    );
  };

  // 改变编辑状态
  changeEditStatus = (attrStr, val, type) => {
    this.setState(
      prevState => ({
        editStatus: {
          ...prevState.editStatus,
          [attrStr]: val,
        },
        editObj: {
          ...prevState.editObj,
          [attrStr]: prevState.initObj[attrStr],
        },
      }),
      () => {
        // const { editStatus } = this.state;
        // console.log('编辑状态数据：', editStatus);
        if (attrStr === 'parentsMailbox' && val) {
          this.validateEmail();
        }
      },
    );
    if(attrStr === 'name' && !val && type !== 'save'){
      Edbox.DataStatistic.ClickEvent('CancelNickName','Profile','')
    }
    if(attrStr === 'birthday' && !val && type !== 'save'){
      Edbox.DataStatistic.ClickEvent('CancelBirth','Profile','')
    }
    if(attrStr === 'sex' && !val && type !== 'save'){
      Edbox.DataStatistic.ClickEvent('CancelSex','Profile','')
    }
  };

  // 点击空白后，邮箱处理
  mailAfterclickEmpty = () => {
    // 收起编辑状态并验证当前编辑值的合理性
    const {
      editObj: { parentsMailbox },
    } = this.state;

    let newParentsMailbox = '';
    if (parentsMailbox) {
      newParentsMailbox = parentsMailbox.replace(/\s/g, '');
    }

    if (!newParentsMailbox) {
      this.setState(prevState => ({
        editObj: {
          ...prevState.editObj,
          parentsMailbox: prevState.initObj.parentsMailbox,
        },
      }));
    }

    this.changeEditStatus('parentsMailbox', false);
    const {
      form: { validateFields },
    } = this.props;

    validateFields(['parentsMailbox'], { force: true }, err => {
      if (err) {
        const { errors } = err.parentsMailbox;
        this.setState({
          tip: errors[0].message,
          tipVisible: true,
          isMailboxCanVerify: false,
        });
      } else {
        this.setState({
          isMailboxCanVerify: true,
        });
      }
    });
  };

  // 点击空白，邮箱处理
  emptyClick = () => {
    this.mailAfterclickEmpty();
  };

  // 显隐控制
  handleCtrlVisble = (targetAttrStr, targeVal) => {
    this.setState({
      [targetAttrStr]: targeVal,
    });
  };

  // 加密邮箱处理
  encryptionEmail = email => {
    const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailReg.test(email)) {
      const temArr = email.split('@');
      const otherPreArrLen = temArr[0].slice(1).length;
      const starArr = new Array(otherPreArrLen).fill('*');
      return `${temArr[0].slice(0, 1)}${starArr.join('')}@${temArr[1]}`;
    } else {
      return email;
    }
  };

  // 点击邮箱验证按钮
  verifyEmail = () => {
    const { isSendedVeify } = this.state;
    if (isSendedVeify) {
      this.setState({
        tip: formatMessage({ id: 'pc_tip_validating' }),
        tipVisible: true,
        isSendedVeify: true,
      });
    } else {
      this.setState({
        tip: formatMessage({ id: 'pc_tip_sended' }),
        tipVisible: true,
        isSendedVeify: true,
      });
    }
  };

  // 字数超出
  validateWordNum = (val, num, formName, errorTip) => {
    const {
      form: { setFields },
    } = this.props;
    if (val.replace(/[^\x00-\xff]/g, 'aa').length > num) {
      setFields({ [formName]: { value: val, errors: [new Error(errorTip)] } });
      if (formName === 'name') {
        this.setState({ isNameCanSave: false });
      }
    } else {
      const {
        form: { setFields },
      } = this.props;
      setFields({ [formName]: { value: val, errors: null } });
      if (formName === 'name') {
        this.setState({ isNameCanSave: true });
      }
    }
  };

  // 生日限制
  birthdayDisabledDate = current => {
    return current && current > moment().endOf('day');
  };

  render() {
    const {
      form: { getFieldDecorator },
      getInfoLoading,
      saveNameLoading,
      saveBirthdayLoading,
      saveSexLoading,
      validateEmailLoading,
    } = this.props;
    const {
      sexData,
      initObj,
      editStatus,
      editObj,
      isVerifiedParentMailbox,
      tipVisible,
      tip,
      isMailboxCanVerify,
      isNameCanSave,
    } = this.state;


    // 新号加密邮箱隐私信息
    const emailShowTxt = this.encryptionEmail(editObj.parentsMailbox);

    const mailboxStatusHtml = (
      <p className={styles['verify-status']}>
        {isVerifiedParentMailbox ? (
          <span className={styles.verified}>{formatMessage({ id: 'pc_verified' })}</span>
        ) : (
          <span className={styles.verifying}>{formatMessage({ id: 'pc_inreview' })}</span>
        )}
      </p>
    );
    return (
      <div className={styles['center-wrap']}>
        {getInfoLoading ? <PageLoading /> : null}
        <div className={styles.mask} onClick={this.emptyClick} />
        <h2 className={styles.tit}>{formatMessage({ id: 'pc_personal_center' })}</h2>
        <p className={styles['warn-tip']} style={{ display: 'none' }}>
          *{formatMessage({ id: 'pc_tip' })}{' '}
        </p>
        <div className={styles['form-wrap']}>
          {/* 头像 */}
          {/* 99u头像不可改，余晓说修改根据这个EditorEnable判断 */}
          <div className={styles['pc-item-wrap']}>
            <label className={styles['item-tit']}>
              {formatMessage({ id: 'pc_profile_photo' })}
            </label>
            <FormItem>
              {getFieldDecorator('profilePhoto', {})(
                <Avatar
                  disabled={!initObj.EditorEnable}
                  initImgUrl={initObj.avatarUrl}
                  onChange={this.updateAvatarUrl}
                />,
              )}
            </FormItem>
          </div>
          {/* 姓名 */}
          <div className={styles['pc-item-wrap']}>
            <label className={styles['item-tit']}>{formatMessage({ id: 'pc_name' })}</label>
            {!editStatus['name'] ? (
              <div className={styles['show-wrap']}>
                <p className={styles['pure-txt']}>{initObj.name ? initObj.name : '-'}</p>
                {/* 99u姓名不可改，余晓说修改根据这个EditorEnable判断 */}
                {!initObj.EditorEnable ? null : (
                  <span
                    className={styles['btn-modify']}
                    onClick={() => this.changeEditStatus('name', true)}
                    title={formatMessage({ id: 'pc_modify_b' })}
                  >
                    {formatMessage({ id: 'pc_modify_b' })}
                  </span>
                )}
              </div>
            ) : (
              <div className={styles['edit-wrap']}>
                <FormItem>
                  {getFieldDecorator('name', {
                    initialValue: initObj.name ? initObj.name : undefined,
                  })(
                    <Input
                      allowClear
                      placeholder={formatMessage({ id: 'pc_placeholder_name' })}
                      onChange={e => this.handleFormItemChange('name', e)}
                    />,
                  )}
                </FormItem>
                <Button
                  loading={saveNameLoading}
                  type="primary"
                  onClick={() => this.modifyItem('name')}
                  disabled={!(editObj.name && isNameCanSave)}
                >
                  {formatMessage({ id: 'pc_save' })}
                </Button>
                <Button
                  className={styles['btn-cancel']}
                  onClick={() => this.changeEditStatus('name', false)}
                >
                  {formatMessage({ id: 'pc_cancel' })}
                </Button>
              </div>
            )}
          </div>
          {/* 生日 */}
          <div className={styles['pc-item-wrap']}>
            <label className={styles['item-tit']}>{formatMessage({ id: 'pc_birthday' })}</label>
            {!editStatus['birthday'] ? (
              <div className={styles['show-wrap']}>
                <p className={styles['pure-txt']}>{initObj.birthday ? initObj.birthday : '-'}</p>
                <span
                  className={styles['btn-modify']}
                  onClick={() => this.changeEditStatus('birthday', true)}
                  title={formatMessage({ id: 'pc_modify_b' })}
                >
                  {formatMessage({ id: 'pc_modify_b' })}
                </span>
              </div>
            ) : (
              <div className={styles['edit-wrap']}>
                <DatePicker
                defaultValue={initObj.birthday
                  ? moment(new Date(Date.parse(initObj.birthday)), 'YYYY-MM-DD')
                  : undefined}
                  disabledDate={this.birthdayDisabledDate}
                  format="YYYY-MM-DD"
                  onChange={(date, dateString) =>
                    this.handleDateChange(date, dateString, 'birthday')
                  }
                />
                <Button
                  loading={saveBirthdayLoading}
                  type="primary"
                  disabled={!editObj.birthday}
                  onClick={() => this.modifyItem('birthday')}
                >
                  {formatMessage({ id: 'pc_save' })}
                </Button>
                <Button
                  className={styles['btn-cancel']}
                  onClick={() => this.changeEditStatus('birthday', false)}
                >
                  {formatMessage({ id: 'pc_cancel' })}
                </Button>
              </div>
            )}
          </div>
          {/* 性别 */}
          <div className={styles['pc-item-wrap']}>
            <label className={styles['item-tit']}>{formatMessage({ id: 'pc_sex' })}</label>
            {!editStatus['sex'] ? (
              <div className={styles['show-wrap']}>
                <p className={styles['pure-txt']}>
                  {initObj.sex === 1
                    ? formatMessage({ id: 'pc_sex_male' })
                    : formatMessage({ id: 'pc_sex_female' })}
                </p>
                <span
                  className={styles['btn-modify']}
                  onClick={() => this.changeEditStatus('sex', true)}
                  title={formatMessage({ id: 'pc_modify_b' })}
                >
                  {formatMessage({ id: 'pc_modify_b' })}
                </span>
              </div>
            ) : (
              <div className={styles['edit-wrap']}>
                <FormItem>
                  {getFieldDecorator('sex', {
                    initialValue: initObj.sex,
                  })(
                    <Group onChange={e => this.handleFormItemChange('sex', e)}>
                      {sexData.map(item => (
                        <Radio value={item.code} key={item.code}>
                          {item.name}
                        </Radio>
                      ))}
                    </Group>,
                  )}
                </FormItem>
                <Button
                  loading={saveSexLoading}
                  type="primary"
                  onClick={() => this.modifyItem('sex')}
                >
                  {formatMessage({ id: 'pc_save' })}
                </Button>
                <Button
                  className={styles['btn-cancel']}
                  onClick={() => this.changeEditStatus('sex', false)}
                >
                  {formatMessage({ id: 'pc_cancel' })}
                </Button>
              </div>
            )}
          </div>
          {/* 家长邮箱 */}
          <div className={styles['pc-item-wrap']} style={{ display: 'none' }}>
            <label className={styles['item-tit']}>
              {formatMessage({ id: 'pc_parent_mailbox' })}
            </label>
            {!editStatus['parentsMailbox'] ? (
              <div className={styles['show-wrap']}>
                <p className={styles['pure-txt']}>{emailShowTxt ? emailShowTxt : '-'}</p>
                {mailboxStatusHtml}
                <span
                  className={styles['btn-modify']}
                  onClick={() => this.changeEditStatus('parentsMailbox', true)}
                  title={formatMessage({ id: 'pc_modify_b' })}
                >
                  {formatMessage({ id: 'pc_modify_b' })}
                </span>
              </div>
            ) : (
              <div className={styles['edit-wrap']}>
                <FormItem>
                  {getFieldDecorator('parentsMailbox', {
                    initialValue: editObj.parentsMailbox ? editObj.parentsMailbox : undefined,
                    rules: [
                      {
                        type: 'email',
                        message: '请输入有效邮箱地址!',
                      },
                    ],
                    validateTrigger: ['onChange'],
                  })(
                    <Input
                      allowClear
                      placeholder={formatMessage({ id: 'pc_placeholder_parent_mailbox' })}
                      onChange={e => this.handleFormItemChange('parentsMailbox', e)}
                    />,
                  )}
                </FormItem>
                {mailboxStatusHtml}
                <Button
                  loading={validateEmailLoading}
                  disabled={!isMailboxCanVerify}
                  type="primary"
                  key="validateBtn"
                  onClick={this.verifyEmail}
                >
                  {formatMessage({ id: 'pc_verify' })}
                </Button>
              </div>
            )}
          </div>
        </div>
        {/* 短消息提示弹窗 */}
        {tipVisible ? (
          <NormalTipModal
            visible={tipVisible}
            modalCancel={() => this.handleCtrlVisble('tipVisible', false)}
            msgTip={tip}
          />
        ) : null}
      </div>
    );
  }
}

export default PersonalCenter;
