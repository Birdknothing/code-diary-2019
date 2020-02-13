import React, { PureComponent } from 'react';
import { Button, Icon, Popover } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import styles from './index.scss';
import defaultBg from '@/assets/bg_img.png';
import StepGuideModal from '@/components/StepGuideModal';

@connect(({ global }) => ({
  global,
}))
class Image01 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      config: this.props.config,
      controls: this.props.controls,
    };
  }



  componentWillReceiveProps(nextProps) {
    this.setState({
      config: { ...nextProps.config },
      controls: { ...nextProps.controls },
    });
  }

  componentWillUnmount() {
    this.setState = (state, callback) => {
      return;
    };
  }
  handleEdit = () => {
    const { config } = this.state;
    this.props.onArouse(config);
  };

  // 去往某一步
  goToStep = (val) => {
    const {
      dispatch,
    } = this.props;

    dispatch({
      type: 'global/setStep',
      payload: {
        activeStep: val,
      },
    });
    dispatch({
      type: 'global/setIsCanOpr',
      payload: {
        isCanOpr: false,
      },
    });
  };

  // 前往图片编辑器
  guideGotoPicEditor = () => {
    const {editorStep:{step},} = this.props;
    console.log('---------------:',step+1);
    this.goToStep(step+1);
    this.handleEdit();
  };

  render() {
    let {
      config: { ID, Value, GUID, Width, Height, ReadOnly, Rotate, ErrorText = '' },
      controls,
    } = this.state;

    const { editorStep } = this.props;
    // console.log('图片编辑器：',editorStep);

    return (
      <div>
        <div className={styles['viewer']}>
          <div className={styles['box']} style={{ backgroundImage: `url("${defaultBg}")` }}>
            <div className={styles['img-wrap']}>
              {Value ? (
                <div
                  className={styles['img']}
                  style={Object.assign(
                    { backgroundImage: `url("${Value}")` },
                    Rotate ? { transform: `rotate(${Rotate}deg)` } : {},
                  )}
                >
                  <a className={styles.download} href={Value} download="edbox_img" target="_blank;">
                    <span />
                  </a>
                </div>
              ) : GUID ? (
                <Icon className={styles['loading']} type="loading" />
              ) : null}
            </div>
          </div>
          {Width && Height ? (
            <div className={styles['sug']}>
              <p className={styles['sug-tit']}>{formatMessage({ id: 'suggest_size' })}</p>
              <p className={styles['sug-size']}>
                {Width}*{Height}px
              </p>
            </div>
          ) : null}
          {ReadOnly ? null : (
            <Popover placement="bottom" content={formatMessage({ id: 'image_edit_tip' })}>
              {/* 新手引导-游戏封面编辑按钮*/}
              {editorStep ? (
                <StepGuideModal
                  isFixed={editorStep.isFixed }
                  step={editorStep.step}
                  isNeedLeftRightByArrow={editorStep.isNeedLeftRightByArrow}
                  handStyle={editorStep.handStyle}
                  popStyle={editorStep.popStyle}
                  placement={editorStep.placement}
                  className={styles['btn-edit-wrap']}
                  title={editorStep.title}
                  ref={this.childDom}
                >
                  <Button
                    ref={el=>{this.childDom=el}}
                    className={
                      controls && controls.ID === ID
                        ? `${styles['btn-edit']} ${styles['active']}`
                        : styles['btn-edit']
                    }
                    shape="circle"
                    onClick={this.guideGotoPicEditor}
                  >
                    <span className={styles.editIcon} />
                  </Button>
                </StepGuideModal>
              ) : (
                <Button
                  className={
                    controls && controls.ID === ID
                      ? `${styles['btn-edit']} ${styles['active']}`
                      : styles['btn-edit']
                  }
                  shape="circle"
                  // icon="form"
                  // disabled={ReadOnly}
                  onClick={() => this.handleEdit()}
                >
                  <span className={styles.editIcon} />
                </Button>
              )}
            </Popover>
          )}
        </div>
        {ErrorText ? <p className={styles['widget-item-error']}>{ErrorText}</p> : null}
      </div>
    );
  }
}

export default Image01;
