import React, { PureComponent,Fragment } from 'react';
import LobbyLayout from './LobbyLayout';
import EditLayout from './EditLayout';
import withRouter from 'umi/withRouter';
import { setLocale } from 'umi/locale';
import { connect } from 'dva';

const { Edbox } = window;
// 登录
Edbox.Start();
// Edbox.Lobby.Init();
@connect(({ global,edit }) => ({
  global,
  edit,
}))
class BasicLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'edit/getDataGameId',
      callback: data => {
        // 设置游戏id
        Edbox.GameID = data.game_id;
        Edbox.Access = '1';
      },
    });

    // 语言切换
    const { Language } = Edbox;
    switch(Language){
      case 'SimplifiedChinese':
        setLocale('zh-CN');
        break;
      case 'English':
        setLocale('en-US');
        break;
      case 'TraditionalChinese_TW':
        setLocale('zh-TW');
        break;
      case 'TraditionalChinese':
        setLocale('zh-HK');
        break;
      default:
        setLocale('zh-CN');
    }
  }
  render() {
    const { children, location,global:{isCanOpr} } = this.props;
    return (
      <Fragment>
      <div className="lobby-editor-page toppest">
        {location.pathname.indexOf('Editor') !== -1 ? (
          <EditLayout children={children} />
        ) : (
          <LobbyLayout children={children} />
        )}
      </div>
      {!isCanOpr?(
      <div className="mask-disable"></div>
      ):null}
      </Fragment>
    );
  }
}

export default withRouter(BasicLayout);
