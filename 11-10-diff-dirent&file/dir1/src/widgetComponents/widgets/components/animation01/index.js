import React, { PureComponent } from 'react';
import { Button, Icon, Popover } from 'antd';
import { formatMessage } from 'umi/locale';
import styles from './index.scss';
import defaultBg from '@/assets/bg_img.png';

class Animation01 extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      config: this.props.config,
      controls: this.props.controls,
    };
  }

  handleEdit = () => {
    const { config } = this.state;
    this.props.onArouse(config);
  };

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

  render() {
    let {
      config: { ID, Preview, GUID, Width, Height, ReadOnly, Rotate, ErrorText = '',ErrorText_Override },
      controls,
    } = this.state;

    ErrorText = ErrorText_Override||ErrorText;

    return (
      <div>
        <div className={styles['viewer']}>
          <div className={styles['box']} style={{ backgroundImage: `url("${defaultBg}")` }}>
            <div className={styles['img-wrap']}>
              {Preview ? (
                <div
                  className={styles['img']}
                  style={Object.assign(
                    { backgroundImage: `url("${Preview}")` },
                    Rotate ? { transform: `rotate(${Rotate}deg)` } : {},
                  )}
                >
                  <a className={styles.download} href={Preview} download="edbox_img" target="_blank;">
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
            <Popover placement="bottom" content={formatMessage({ id: 'animation_edit_tip' })}>
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
            </Popover>
          )}
        </div>
        {ErrorText ? <p className={styles['widget-item-error']}>{ErrorText}</p> : null}
      </div>
    );
  }
}

export default Animation01;
