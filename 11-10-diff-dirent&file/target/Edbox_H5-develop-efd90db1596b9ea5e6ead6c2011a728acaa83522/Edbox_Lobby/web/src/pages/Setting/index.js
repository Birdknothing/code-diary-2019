import React, { PureComponent, Fragment } from 'react';
import cookie from 'react-cookies';
import router from 'umi/router';
import moment from 'moment';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { Form, Select, Anchor, message, Affix } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import styles from './index.scss';

import PageLoading from '@/components/PageLoading';
import ConfirmModal from './components/ConfirmModal';

const FormItem = Form.Item;
const { Option } = Select;
const { Link } = Anchor;
const { Edbox } = window;

@connect(({ setting, loading, lobby }) => ({
  setting,
  lobby,
  loadingSetting: loading.models.setting,
}))
@Form.create()
class Setting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lanList: [
        {
          title: formatMessage({ id: 'set_lan_cn' }),
          value: 'zh-CN',
        },
        {
          title: formatMessage({ id: 'set_lan_en' }),
          value: 'en-US',
        },
        {
          title: formatMessage({ id: 'set_lan_tcn' }),
          value: 'zh-TW',
        },
        {
          title: formatMessage({ id: 'set_lan_hcn' }),
          value: 'zh-HK',
        },
      ],
      logList: [],
      currentVer: '',
      isConfirmVisible: false,
      isNewest: false,
      lanVal: Edbox.Language,
      tip: '',

      loading: false,
      hasMore: true,
      count: 0,
      page: 1,
    };
  }

  componentDidMount() {
    const { page } = this.state;
    this.getUpdateLog(page);
    // 如果是海外，则屏幕中文下拉框
    if(Edbox.ServerKey==='Beta'||Edbox.ServerKey==='HK'||Edbox.ServerKey==='US'){
      this.setState({
        lanList:[
          {
            title: formatMessage({ id: 'set_lan_en' }),
            value: 'en-US',
          },
        ],
      });
    }
  }

  getUpdateLog = page => {
    const { dispatch } = this.props;
    dispatch({
      type: 'setting/getUpdateLog',
      payload: {
        page,
        size: 3,
      },
      callback: res => {
        this.setState(prevState => ({
          logList: prevState.logList.concat([...res.data]),
          currentVer: res.Currentver,
          count: res.count,
          page: page + 1,
          hasMore: true,
          loading: false,
        }),()=>{
          const {currentVer,isNewest,logList} = this.state;
          if(!isNewest){
            const hasInLogList = logList[0]&&logList[0].ver.indexOf(currentVer)>-1;
            this.setState({
              isNewest:hasInLogList,
            });
          }

        });
      },
    });
  };

  // 语言改变
  handleLanSelectChange = val => {
    let tip = '';
    let lanVal = '';
    switch (val) {
      case 'zh-CN':
        lanVal = 'SimplifiedChinese';
        tip = formatMessage({ id: 'set_lan_change_tip_cn' });
        break;
      case 'en-US':
        lanVal = 'English';
        tip = formatMessage({ id: 'set_lan_change_tip_en' });
        break;
      case 'zh-TW':
        lanVal = 'TraditionalChinese_TW';
        tip = formatMessage({ id: 'set_lan_change_tip_tcn' });
        break;
      case 'zh-HK':
        lanVal = 'TraditionalChinese';
        tip = formatMessage({ id: 'set_lan_change_tip_tcn' });
        break;
      default:
        lanVal = 'SimplifiedChinese';
        tip = formatMessage({ id: 'set_lan_change_tip_cn' });
    }

    this.setState({
      isConfirmVisible: true,
      lanVal,
      tip,
    });
  };

  changeLan = () => {
    const { lanVal } = this.state;
    Edbox.SetLanguage(lanVal);
    cookie.save('settinglanVal', lanVal, { path: '/' });
    router.push('/');
  };

  cancelChangeLan = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields(['lanSelection']);
    this.setState({
      isConfirmVisible: false,
    });
    router.push('/');
  };

  formateTime = time => {
    const fTime = moment(time).valueOf();
    return moment(fTime).format('YYYY.MM.DD');
  };

  cancelDefault = e => {
    e.preventDefault();
  };

  handleInfiniteOnLoad = () => {
    const { logList, count, page } = this.state;
    this.setState({
      loading: true,
    });
    if (logList.length >= count) {
      message.success(formatMessage({ id: 'set_load_finished' }));
      this.setState({
        hasMore: false,
        loading: false,
      });
      return;
    }
    this.getUpdateLog(page);
  };

  render() {
    const {
      form: { getFieldDecorator },
      loadingSetting,
      lobby,
    } = this.props;
    const {
      lanList,
      logList,
      currentVer,
      isConfirmVisible,
      tip,
      loading,
      hasMore,
      isNewest,
    } = this.state;

    //setLocale('en-US')getLocale() === 'en-US' SimplifiedChinese
    return (
      <div className={styles['setting-wrap']}>
        {lobby.el ? (
          <Affix offsetTop={10} target={() => lobby.el}>
            <div className={styles['left-tit-wrap']}>
              <h3 className={styles['sec-tit']}>{formatMessage({ id: 'set_tit_name' })}</h3>
              <div className={styles['s-tit-list']}>
                <Anchor affix={false} onClick={this.cancelDefault} getContainer={() => lobby.el}>
                  <Link
                    href="#sysSetting"
                    className={`${styles['s-tit']}`}
                    title={formatMessage({ id: 'set_sys_setting' })}
                  />
                  <Link
                    href="#updateLog"
                    className={styles['s-tit']}
                    title={formatMessage({ id: 'set_log' })}
                  />
                </Anchor>
              </div>
            </div>
          </Affix>
        ) : null}
        <div
          className={styles['right']}
          ref={el => {
            this.el = el;
          }}
        >
          {/* 语言选择 */}
          <div id="sysSetting" className={styles['lan-choose-wrap']}>
            <h4 className={styles['cont-tit']}>{formatMessage({ id: 'set_sys_setting' })}</h4>
            <div className={styles['set-form-wrap']}>
              <label htmlFor="" className={styles['lable']}>
                {formatMessage({ id: 'set_lan_choose' })}
              </label>
              <FormItem label="">
                {getFieldDecorator('lanSelection', {
                  initialValue: Edbox.Language === 'English' ? 'en-US' : (Edbox.Language === 'SimplifiedChinese' ? 'zh-CN' : (Edbox.Language === 'TraditionalChinese_TW' ? 'zh-TW' : 'zh-HK')),
                })(
                  <Select
                    style={{ width: 200 }}
                    placeholder={formatMessage({ id: 'set_lan_placeholder' })}
                    onChange={this.handleLanSelectChange}
                  >
                    {lanList.map((item, index) => (
                      <Option value={item.value} key={index}>
                        {item.title}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
              <p className={styles['form-tip']}>{formatMessage({ id: 'set_tip_txt' })}</p>
            </div>
          </div>
          {/* 日志更新 */}
          <div className={styles['update-wrap']}>
          {/* <div className={styles['update-wrap']} style={{display:"none"}}> */}
            {loadingSetting ? <PageLoading /> : null}
            <div>
              <h4 id="updateLog" className={styles['cont-tit']}>
                {formatMessage({ id: 'set_log' })}
              </h4>
              <div className={styles['update-cont']}>
                <p className={styles['now-ver']}>
                  {formatMessage({ id: 'set_log_now_version' })}
                  {currentVer}
                  {isNewest?(
                  <span>{formatMessage({ id: 'set_log_now_tip' })}</span>
                  ):null}
                </p>
                <div className={styles['log-list']}>
                  <InfiniteScroll
                    initialLoad={false}
                    pageStart={1}
                    loadMore={this.handleInfiniteOnLoad}
                    hasMore={!loading && hasMore}
                    useWindow={false}
                    threshold={10}
                    getScrollParent={() => lobby.el}
                  >
                    {logList.map(item => (
                      <div className={styles['log-item']} key={item.id}>
                        <p className={styles['ver']}>
                          {Edbox.Language === 'English'
                            ? `${item.ver}`
                            : `${item.ver}`}
                        </p>
                        {item.updateLoglist&&item.updateLoglist.map((logItem, index) => (
                          <Fragment key={index}>
                            <p className={styles['detail']}>
                              {`${this.formateTime(logItem.update_time)}${formatMessage({
                                id: 'set_log_detail',
                              })}`}
                            </p>
                            <p
                              className={styles['intro']}
                              dangerouslySetInnerHTML={{ __html: logItem.detail }}
                            />
                          </Fragment>
                        ))}
                      </div>
                    ))}
                  </InfiniteScroll>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 确认弹窗 */}
        {isConfirmVisible ? (
          <ConfirmModal
            visible={isConfirmVisible}
            onSure={this.changeLan}
            txt={tip}
            modalCancel={this.cancelChangeLan}
          />
        ) : null}
      </div>
    );
  }
}

export default Setting;
