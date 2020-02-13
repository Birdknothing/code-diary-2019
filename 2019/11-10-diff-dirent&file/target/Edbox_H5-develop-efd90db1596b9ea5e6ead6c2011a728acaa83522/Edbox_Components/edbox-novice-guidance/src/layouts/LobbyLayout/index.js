import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Affix } from 'antd';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import LobbyHeader from '../LobbyHeader';
import LobbySidebar from '../LobbySidebar';

import StepGuideModal from '@/components/StepGuideModal';

@connect(({ global,lobby, loading }) => ({
  global,
  lobby,
  loading: loading.models.global,
}))
class LobbyLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.resizeListener();
    this.screenChange();
    this.getEl();
  }
  getEl = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'lobby/setEl',
      payload: {
        el: this.el,
      },
    });
  };

  resizeListener = () => {
    const { dispatch } = this.props;
    if (document.documentElement.clientWidth < 1600) {
      dispatch({
        type: 'lobby/setSidebar',
        payload: {
          layoutShow: false,
        },
      });
      dispatch({
        type: 'lobby/setResize',
        payload: {
          resizeMin: true,
        },
      });
    } else {
      dispatch({
        type: 'lobby/setResize',
        payload: {
          resizeMin: false,
        },
      });
    }

    if (document.documentElement.clientWidth >= 1850) {
      dispatch({
        type: 'lobby/setResizeMax',
        payload: {
          resizeMax: true,
        },
      });
    } else {
      dispatch({
        type: 'lobby/setResizeMax',
        payload: {
          resizeMin: false,
        },
      });
    }
  };

  screenChange = () => {
    window.addEventListener('resize', this.resizeListener);
  };

  // 去往某步
  goToStep = (val) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/setStep',
      payload: {
        activeStep:val,
      },
    });
    dispatch({
      type: 'global/setIsCanOpr',
      payload: {
        isCanOpr: false,
      },
    });
  };

  // 前往创作列表
  guideGoToCreate=()=>{
    this.goToStep(2);
    router.push('/LobbyCreat');
  }
  render() {
    const { children, lobby } = this.props;
    return (
      <div className={'edboxLayout'}>
        <LobbyHeader />
        <section className={'edbox-main'}>
          <LobbySidebar show={lobby.layoutShow} />
          <div
            className={'edbox-view'}
            ref={el => {
              this.el = el;
            }}
          >
            {children}
          </div>
        </section>
        <Affix offsetBottom={15} style={{ position: 'absolute', right: 15 }} target={() => this.el}>
          {/* 创建按钮-引导开始1 */}
          <StepGuideModal
            isFixed
            step={1}
            placement="TR"
            width={242}
            title={formatMessage({ id: 'g_tip_create_game' })}
            handStyle={{ marginLeft: '14px', marginBottom: '47px' }}
          >
            <div className={'edbox-creat'} onClick={this.guideGoToCreate} />
          </StepGuideModal>
        </Affix>
      </div>
    );
  }
}

export default LobbyLayout;
